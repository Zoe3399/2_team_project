from flask import Flask
from flask_cors import CORS

# 더미 API BP import (경로/이름이 정확해야 함)
from api.production.summary_dummy_api import summary_dummy_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')

    # CORS 세팅
    CORS(app, supports_credentials=True, origins=['http://localhost:5173'])

    # DB 연결 안 쓰면 주석처리
    # db.init_app(app)

    # 더미 API BP 등록
    app.register_blueprint(summary_dummy_bp)

    @app.errorhandler(500)
    def internal_error(error):
        return {"success": False, "message": "서버 내부 오류"}, 500

    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
        return response

    return app

app = create_app()