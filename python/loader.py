import pandas as pd
from pathlib import Path
import warnings

# Silence terminal warnings for a clean backend execution
warnings.filterwarnings("ignore", category=UserWarning)

def load_and_clean(file_path):
    path = Path(file_path)
    
    # 1. Load EVERY sheet (2022, 2023, 2024, 2025)
    all_sheets = pd.read_excel(path, sheet_name=None)
    
    # 2. Strip accidental duplicate columns from any sheet
    clean_sheets = []
    for sheet_name, sheet_data in all_sheets.items():
        # This removes duplicate column headers so pd.concat doesn't crash
        sheet_data = sheet_data.loc[:, ~sheet_data.columns.duplicated()]
        clean_sheets.append(sheet_data)
        
    # 3. Combine into one master dataset safely
    df = pd.concat(clean_sheets, ignore_index=True)
    
    # 4. NUCLEAR FIX: Dynamic Date Parsing
    # We remove the strict 'format=' because your years have different formats.
    # dayfirst=True ensures things like 15/02/2022 are parsed correctly.
    df['OrderDate'] = pd.to_datetime(df['OrderDate'], errors='coerce', dayfirst=True)
    df = df.dropna(subset=['OrderDate', 'Quantity']) 
    
    # NOTE: We intentionally DO NOT set the index here anymore. 
    # Keeping the dataset flat prevents the duplicate label crash.
    
    return df