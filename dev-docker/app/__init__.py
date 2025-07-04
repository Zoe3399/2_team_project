from flask import Flask, app  # Flask 웹 프레임워크 임포트
from flask_cors import CORS  # Cross-Origin Resource Sharing 허용
from dotenv import load_dotenv  # .env 파일 환경변수 로더
import os  # 운영체제 환경변수 제어용
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail # type: ignore

db = SQLAlchemy()
mail = Mail()

def create_app():
    # .env 파일에서 환경변수 불러오기 (.env의 DB 정보가 시스템 환경변수로 등록됨)
    load_dotenv()

    # Flask 애플리케이션 인스턴스 생성
    app = Flask(__name__)

    # CORS 설정: 프론트 개발 서버에서 API 호출 허용
    CORS(
        app,
        resources={r"/api/*": {"origins": "http://localhost:5173"}},
        methods=["GET", "POST", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"]
    )


    # SQLAlchemy 데이터베이스 접속 URI 구성
    db_user = os.getenv('DB_USER')
    db_password = os.getenv('DB_PASSWORD')
    db_host = os.getenv('DB_HOST')
    db_port = os.getenv('DB_PORT', 3306)
    db_name = os.getenv('DB_NAME')

    app.config['SQLALCHEMY_DATABASE_URI'] = (
        f"mysql+pymysql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    mail.init_app(app)

    # Blueprint 등록 (라우트 분리)
    # from .routes.main import bp as main_bp # type: ignore
    # app.register_blueprint(main_bp)

    # 인증 관련 블루프린트
    # from .api.auth.register import register_bp       # 이메일 인증 코드 발송
    # from .api.auth.login import login_bp             # 로그인 처리
    # from .api.auth.verify_email import verify_email_bp   # type: ignore # 이메일 인증 완료
    # from .api.auth.password_reset import password_reset_bp # type: ignore # 비밀번호 재설정

    # 이메일 회원가입 및 인증 코드 발송
    # app.register_blueprint(register_bp, url_prefix='/api/auth')
    # 로그인
    # app.register_blueprint(login_bp, url_prefix='/api/auth')
    # 이메일 인증 완료
    # app.register_blueprint(verify_email_bp, url_prefix='/api/auth')
    # 비밀번호 재설정
    # app.register_blueprint(password_reset_bp, url_prefix='/api/auth')

    from .api.production.summary import summary_bp  # summary API 라우트
    app.register_blueprint(summary_bp, url_prefix='/api/production')

    # 설정이 완료된 Flask 앱 객체 반환
    return app
