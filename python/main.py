import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from pathlib import Path
from sklearn.metrics import mean_absolute_percentage_error
from prophet import Prophet
from statsmodels.tsa.statespace.sarimax import SARIMAX
from mlxtend.frequent_patterns import apriori, association_rules
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder

# Internal Imports
from loader import load_and_clean
from visualizer import generate_visuals

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOADS_DIR = Path(__file__).parent.parent / "uploads"
CACHE_DIR = Path(__file__).parent.parent / "cache"
CACHE_DIR.mkdir(exist_ok=True)

@app.get("/process-all/{filename}")
def process_all(filename: str):
    file_path = UPLOADS_DIR / filename
    cache_path = CACHE_DIR / f"{filename}.json"
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found.")

    try:
        # 1. Unified Load
        raw_data = load_and_clean(file_path)
        
        # --- MODEL A: FORECASTER (Prophet/SARIMA) ---
        weekly_data = raw_data.groupby(pd.Grouper(key='OrderDate', freq='W'))['Quantity'].sum().reset_index()
        weekly_data.columns = ['ds', 'y']
        
        m = Prophet(yearly_seasonality=True, weekly_seasonality=True).fit(weekly_data)
        forecast = m.predict(m.make_future_dataframe(periods=4, freq='W'))
        
        sarima_res = SARIMAX(weekly_data['y'], order=(1,1,1), seasonal_order=(1,1,1,4)).fit(disp=False)
        sarima_pred = sarima_res.get_forecast(steps=4).predicted_mean
        
        y_true = weekly_data['y'].tail(4).values
        y_pred = forecast['yhat'].iloc[-8:-4].values
        acc = max(0, 100 - (mean_absolute_percentage_error(y_true, y_pred) * 100))
        graph_loc = generate_visuals(weekly_data, sarima_pred, forecast.tail(4), len(raw_data))

        # --- MODEL B: MARKET ANALYSIS (Apriori) ---
        basket = (raw_data.groupby(['OrderID', 'ItemDescription'])['Quantity']
                  .sum().unstack().reset_index().fillna(0).set_index('OrderID'))
        basket_sets = basket.map(lambda x: True if x >= 1 else False)
        freq_sets = apriori(basket_sets, min_support=0.01, use_colnames=True)
        rules = association_rules(freq_sets, metric="lift", min_threshold=1)
        top_bundles = rules.sort_values('confidence', ascending=False).head(10)
        
        bundles_list = [{"item_a": list(row['antecedents'])[0], "item_b": list(row['consequents'])[0], 
                         "confidence": f"{row['confidence']*100:.1f}%"} for _, row in top_bundles.iterrows()]

        # --- MODEL C: INFLUENCE (Random Forest) ---
        df_rf = raw_data.copy()
        df_rf['Month'] = df_rf['OrderDate'].dt.month
        df_rf['DayOfWeek'] = df_rf['OrderDate'].dt.dayofweek
        le = LabelEncoder()
        df_rf['Wh_Enc'] = le.fit_transform(df_rf['Warehouse'].astype(str))
        
        X = df_rf[['Wh_Enc', 'Unit Cost', 'Month', 'DayOfWeek']]
        y = df_rf['Quantity']
        rf = RandomForestRegressor(n_estimators=100, random_state=42).fit(X, y)
        
        influence_results = [{"factor": n, "score": round(s * 100, 1)} 
                            for n, s in zip(['Warehouse', 'Price', 'Month', 'Day'], rf.feature_importances_)]

        # --- SAVE TO CACHE ---
        final_data = {
            "forecast": {
                "accuracy": f"{acc:.1f}%", "graph": graph_loc,
                "yoy": {"labels": forecast.tail(4)['ds'].dt.strftime('%b %d').tolist(),
                        "current": forecast.tail(4)['yhat'].round(0).tolist(),
                        "previous": weekly_data['y'].tail(4).tolist()}
            },
            "market": {"bundles": bundles_list, "total": len(basket)},
            "influence": {"top": sorted(influence_results, key=lambda x: x['score'], reverse=True)[0]['factor'],
                          "list": sorted(influence_results, key=lambda x: x['score'], reverse=True)}
        }

        with open(cache_path, 'w') as f:
            json.dump(final_data, f)
            
        return {"status": "Complete", "message": "All models pre-computed."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Simplified endpoints that only read the cache
@app.get("/get-results/{filename}")
def get_results(filename: str):
    cache_path = CACHE_DIR / f"{filename}.json"
    if not cache_path.exists():
        raise HTTPException(status_code=404, detail="Analysis not ready.")
    with open(cache_path, 'r') as f:
        return json.load(f)