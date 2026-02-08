# .py imports
from loader import loadNclean
from plotting import dataPlotter

# library imports
from pathlib import Path
from statsmodels.tsa.statespace.sarimax import SARIMAX

file_path = Path(__file__).parent.resolve()

dataset = '1770129962785-Sales_2022 to 2025.xlsx'
dirDataSet = file_path.parent / 'uploads' / dataset
print(dirDataSet)
data = loadNclean(str(dirDataSet))
ts_data = data['Quantity'].resample('D').sum().fillna(0)
plot_df = ts_data.reset_index()

dataPlotter(df=plot_df, x='OrderDate', y='Quantity')
