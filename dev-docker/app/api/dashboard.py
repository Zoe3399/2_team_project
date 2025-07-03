from flask import Blueprint, jsonify
from app.models.forecast import ForecastResult  # type: ignore # 예시 모델

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/api/dashboard', methods=['GET'])
def get_dashboard_data():
    # DB에서 데이터 조회해서 jsonify로 응답
    return jsonify({'status': 'ok'})