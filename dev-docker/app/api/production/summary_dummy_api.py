from flask import Blueprint, jsonify
import pandas as pd
import os

# Blueprint 이름을 summary_dummy_bp로 변경
summary_dummy_bp = Blueprint('summary_dummy', __name__, url_prefix='/api/production')

# CSV 파일 경로
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, '../../DB_insert/data')
CSV_FILE = os.path.join(DATA_DIR, 'option1_merged_exclude_sejong.csv')

@summary_dummy_bp.route('/summary_dummy', methods=['GET'])
def get_dummy_summary():
    try:
        df = pd.read_csv(CSV_FILE)
        # month 컬럼을 날짜로 변환
        df['month'] = pd.to_datetime(df['month'])
        max_month = df['month'].max()
        min_month = max_month - pd.DateOffset(months=3)
        dummy = df[df['month'] >= min_month].head(10)
        data = dummy.to_dict(orient='records')
        return jsonify({'success': True, 'data': data})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})