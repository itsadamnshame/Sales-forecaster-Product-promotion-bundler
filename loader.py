import pandas as pd

def load_and_clean(file_name):
    df = pd.read_csv(file_name)
    df['OrderDate'] = pd.to_datetime(df['OrderDate'], format='%d/%m/%Y %I:%M:%S %p')
    df.set_index('OrderDate', inplace=True)
    df.sort_index(inplace=True)
    return df