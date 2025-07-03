import traceback
from flask import Blueprint, jsonify
from flask_cors import CORS
from app import db
from sqlalchemy import extract, text
from datetime import datetime
from dateutil.relativedelta import relativedelta


summary_bp = Blueprint("summary", __name__)
CORS(summary_bp)

@summary_bp.route("/summary", methods=["GET"])  # url_prefix와 결합되어 최종 경로는 /api/production/summary가 됩니다.
def get_production_summary():
    try:
        # 가장 최신 실제 데이터 날짜 기준
        latest = db.session.execute(
            text("SELECT date FROM region_data ORDER BY date DESC LIMIT 1")
        ).fetchone()
        if not latest:
            return jsonify({"success": False, "message": "실제 데이터가 없습니다."}), 404

        base = latest[0]
        print("base:", base)

        start_date = (base + relativedelta(months=-3)).replace(day=1)
        end_date = (base + relativedelta(months=3)).replace(day=28)  # 안전하게 월말 가정

        months = [(base + relativedelta(months=i)).strftime("%Y-%m") for i in range(-3, 4)]
        print("months:", months)

        # 실제 생산지수 조회 (가장 첫 번째 지역 기준)
        region_row = db.session.execute(
            text("SELECT region_id FROM region_data LIMIT 1")
        ).fetchone()

        if not region_row:
            return jsonify({"success": False, "message": "region_id가 없습니다."}), 404

        region_id = region_row[0]
        print("region_id:", region_id)

        actual_rows = db.session.execute(
            text("""
            SELECT date, production_index FROM region_data 
            WHERE region_id = :region_id 
            AND date BETWEEN :start_date AND :end_date
            """),
            {"region_id": region_id, "start_date": start_date, "end_date": end_date}
        ).fetchall()
        actual_data = {row.date.strftime("%Y-%m"): row.production_index for row in actual_rows}
        print("actual_data:", actual_data)

        # 예측 생산지수 조회
        predicted_rows = db.session.execute(
            text("""
            SELECT forecast_date, predicted_index FROM forecast_results
            WHERE region_id = :region_id
            AND forecast_date BETWEEN :start_date AND :end_date
            """),
            {"region_id": region_id, "start_date": start_date, "end_date": end_date}
        ).fetchall()
        predicted_data = {row.forecast_date.strftime("%Y-%m"): row.predicted_index for row in predicted_rows}
        print("predicted_data:", predicted_data)

        # 월별로 데이터 구성
        result = []
        for m in months:
            result.append({
                "date": m,
                "actual": actual_data.get(m),
                "predicted": predicted_data.get(m)
            })

        return jsonify({"success": True, "data": result})

    except Exception as e:
        traceback.print_exc()
        return jsonify({"success": False, "message": str(e)}), 500