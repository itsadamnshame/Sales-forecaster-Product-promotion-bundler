import pandas as pd

def loadNclean(file_name):
    if file_name.endswith('.xlsx') or file_name.endswith('.xls'):
        df = pd.read_excel(file_name)
    else:
        df = pd.read_csv(file_name)
    df['OrderDate'] = pd.to_datetime(df['OrderDate'], format='%d/%m/%Y %I:%M:%S %p')
    df.set_index('OrderDate', inplace=True)
    df.sort_index(inplace=True)
    return df