from pathlib import Path
from loader import load_and_clean
from statsmodels.tsa.statespace.sarimax import SARIMAX

file_path = Path(__file__).resolve()
file_folder = str(file_path.parent)

dataset = '1770083555351-Sales_2022 to 2025.xlsx'
dirDataSet = (file_folder + '/uploads/' + dataset)

data = load_and_clean(dirDataSet)
ts_data = data['Quantity'].resample('D').sum().fillna(0)
