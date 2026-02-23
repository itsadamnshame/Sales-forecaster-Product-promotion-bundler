import pandas as pd
import plotly.graph_objects as go
from pathlib import Path
import os

# 1. PATHING SETUP
# Since this file is in /python, we get the current directory
BASE_DIR = Path(__file__).parent 
EXPORT_FOLDER_TEMP = BASE_DIR / "exports" / "temp"
EXPORT_FOLDER_SAVED = BASE_DIR / "exports" / "saved"

# Ensure folders exist locally within the python directory
EXPORT_FOLDER_TEMP.mkdir(parents=True, exist_ok=True)
EXPORT_FOLDER_SAVED.mkdir(parents=True, exist_ok=True)

# Define the physical path where the file will be saved
EXPORT_PATH = EXPORT_FOLDER_TEMP / "forecast_graph.html"

def generate_visuals(historical_df, sarima_pred, prophet_df, record_count):
    """
    Generates an interactive Plotly graph for the Forecaster page.
    Prevents 'fig' definition errors by initializing the figure early.
    """
    # INITIALIZE FIGURE IMMEDIATELY
    # This prevents the "name 'fig' is not defined" error if the data processing fails.
    fig = go.Figure()

    try:
        # 2. DATA CONVERSION
        # Convert Pandas Series to pure Python lists to prevent indexing errors.
        hist_x = historical_df['ds'].tail(24).tolist()
        hist_y = historical_df['y'].tail(24).tolist()
        
        proph_x = prophet_df['ds'].tolist()
        proph_y = prophet_df['yhat'].round(0).tolist()
        
        # sarima_pred is a series; extract the raw numbers
        sarima_y = sarima_pred.round(0).tolist()

        # 3. ADDING TRACES
        # Historical Trend
        fig.add_trace(go.Scatter(
            x=hist_x, y=hist_y,
            name="Past Sales", 
            line=dict(color='#bdc3c7', width=2)
        ))

        # Prophet Forecast (The AI Prediction)
        fig.add_trace(go.Scatter(
            x=proph_x, y=proph_y,
            mode='lines+markers',
            hovertemplate="<b>Date</b>: %{x}<br><b>Units</b>: %{y}<extra></extra>",
            name="AI Forecast (Prophet)",
            text=proph_y,
            textposition="top center",
            line=dict(color='#2ecc71', width=4)
        ))

        # SARIMA Forecast (The Statistical Baseline)
        fig.add_trace(go.Scatter(
            x=proph_x, y=sarima_y,
            mode='lines+markers',
            hovertemplate="<b>Date</b>: %{x}<br><b>Units</b>: %{y}<extra></extra>",
            name="Statistical Baseline (SARIMA)",
            line=dict(color='#3498db', dash='dot')
        ))

        # 4. LAYOUT & THEMING
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
        
        # 5. SAVE AND RETURN
        # Save to the physical directory
        fig.write_html(str(EXPORT_PATH), full_html=False, include_plotlyjs='cdn')
        
        # Return the URL path that app.js uses in its static route
        return "exports/temp/forecast_graph.html"

    except Exception as e:
        print(f"CRITICAL ERROR in visualizer.py: {str(e)}")
        # If processing fails, we return a fallback or re-raise the error for main.py
        raise e