import pandas as pd
import plotly.express as px
from pathlib import Path

fileRoot = Path(__file__).parent.parent
exportDir = fileRoot / 'py_export' / 'temp_graph.html'

def exportGraph(fig, filename=exportDir):
    filename.parent.mkdir(parents=True, exist_ok=True)
    fig.write_html(filename, full_html=False, include_plotlyjs='cdn')

def dataPlotter(df: pd.DataFrame, x: str, y: str) -> None:
    count = len(df)
    
    # 2. Use the x and y parameters provided in the function call
    fig = px.line(df, x=x, y=y, labels={x: 'Date', y: 'Units Sold'})
    
    # 3. Add the count to the title using an f-string
    fig.update_layout(
        template='simple_white', 
        font=dict(size=18), 
        title_text=f'Sales Forecast Data (Total Points: {count})', # Updated Title
        width=800, 
        title_x=0.5, 
        height=400
    )
    fig.show()
    exportGraph(fig)

