from flask import Flask
from flask_cors import CORS
from api.production.summary import summary_bp
from app.models.user import db          # DB 객체

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')
    CORS(app, supports_credentials=True, origins=['http://localhost:5173'])
    db.init_app(app)
    app.register_blueprint(summary_bp, url_prefix='/api/production')

    @app.errorhandler(500)
    def internal_error(error):
        return {"success": False, "message": "서버 내부 오류"}, 500

    @app.after_request
    def after_request(response):
        if not response.headers.get('Access-Control-Allow-Origin'):
            response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
            response.headers.add('Access-Control-Allow-Credentials', 'true')
            response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
            response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
        if response.status_code == 405 and response.request.method == 'OPTIONS':
            response.status_code = 200
        return response

    return app

# 마지막에 위치시킴
from app import create_app
app = create_app()