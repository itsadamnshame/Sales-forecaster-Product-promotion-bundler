import pandas as pd
import plotly.graph_objects as go
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
EXPORT_PATH = BASE_DIR / "html" / "forecast_graph.html"

def generate_visuals(historical_df, sarima_pred, prophet_df, record_count):
    fig = go.Figure()

    # THE FIX: Convert Pandas Series to pure Python lists
    # This completely eliminates "duplicate label reindexing" crashes
    hist_x = historical_df['ds'].tail(24).tolist()
    hist_y = historical_df['y'].tail(24).tolist()
    
    proph_x = prophet_df['ds'].tolist()
    proph_y = prophet_df['yhat'].round(0).tolist()
    
    # sarima_pred is a series, we extract just the raw numbers
    sarima_y = sarima_pred.round(0).tolist()

    # 1. Historical Trend (Last 6 months for context)
    fig.add_trace(go.Scatter(
        x=hist_x, y=hist_y,
        name="Past Sales", line=dict(color='#bdc3c7', width=2)
    ))

    # 2. Prophet Forecast (The AI Prediction)
    fig.add_trace(go.Scatter(
        x=proph_x, y=proph_y,
        mode='lines+markers',
        hovertemplate="<b>Date</b>: %{x}<br><b>Units</b>: %{y}<extra></extra>",
        name="AI Forecast (Prophet)",
        text=proph_y,
        textposition="top center",
        line=dict(color='#2ecc71', width=4)
    ))

    # 3. SARIMA Forecast (The Statistical Baseline)
    fig.add_trace(go.Scatter(
        x=proph_x, y=sarima_y,
        mode='lines+markers',
        hovertemplate="<b>Date</b>: %{x}<br><b>Units</b>: %{y}<extra></extra>",
        name="Statistical Baseline (SARIMA)",
        line=dict(color='#3498db', dash='dot')
    ))

    # 4. Layout & Theming
    fig.update_layout(
        showlegend=False, 
        legend=dict(
            font=dict(family="Arial", size=14, color="white"), 
            bgcolor="rgba(10, 25, 41, 0.8)", 
            bordercolor="gray",
            borderwidth=1,
            orientation="h", 
            yanchor="bottom",
            y=1.02,
            xanchor="right",
            x=1
        ),
        template='plotly_dark',
        paper_bgcolor='rgba(0,0,0,0)', 
        plot_bgcolor='rgba(0,0,0,0)',
        title=f"Sales Forecast Analysis ({record_count:,} Records Processed)",
        hovermode="x unified", 
        hoverlabel=dict(bgcolor="#2c3e50", font_size=14),
    )
    
    fig.write_html(str(EXPORT_PATH), full_html=False, include_plotlyjs='cdn')
    return "forecast_graph.html"