import pandas as pd
from pathlib import Path

def loadNclean(file_name):
    path = Path(file_name)

    if path.suffix in ['.xlsx', '.xls']:
        df = pd.read_excel(path)
    else:
        df = pd.read_csv(path)
    df['OrderDate'] = pd.to_datetime(df['OrderDate'], format='%d/%m/%Y %I:%M:%S %p')
    df.set_index('OrderDate', inplace=True)
    df.sort_index(inplace=True)
    return df