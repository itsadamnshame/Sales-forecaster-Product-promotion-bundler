import pandas as pd
import plotly.express as px

def exportGraph(fig, filename="temp_graph.html"):
    fig.write_html(filename, full_html=False, include_plotlyjs='cdn')

def dataPlotter(df: pd.DataFrame, x: str, y: str) -> None:
    # Use the x and y parameters provided in the function call
    fig = px.line(df, x=x, y=y, labels={x: 'Date', y: 'Units Sold'})
    
    fig.update_layout(
        template='simple_white', 
        font=dict(size=18), 
        title_text='Sales Forecast Data',
        width=800, # Increased slightly for better visibility
        title_x=0.5, 
        height=400
    )
    fig.show()
    exportGraph(fig)

