import sys
import pandas as pd
import json

def analyze_csv(file_path):
    try:
        df = pd.read_csv(file_path)

        summary = {
            "total_rows": len(df),
            "total_columns": len(df.columns),
            "columns": list(df.columns),
            "data_types": df.dtypes.astype(str).to_dict(),
            "missing_values": df.isnull().sum().to_dict()
        }

        return summary

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: python processor.py <file.csv>"}))
        sys.exit(1)

    file_path = sys.argv[1]
    result = analyze_csv(file_path)

    print(json.dumps(result))
