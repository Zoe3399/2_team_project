from flask import Flask  # Flask 웹 프레임워크 임포트
from dotenv import load_dotenv  # .env 파일 환경변수 로더
import os  # 운영체제 환경변수 제어용

def create_app():
    # .env 파일에서 환경변수 불러오기 (.env의 DB 정보가 시스템 환경변수로 등록됨)
    load_dotenv()

    # Flask 애플리케이션 인스턴스 생성
    app = Flask(__name__)

    # SQLAlchemy 데이터베이스 접속 URI를 환경변수로부터 구성 (필수)
    # 예시: mysql+pymysql://user:password@db:3306/데이터베이스명
    db_user = os.getenv('DB_USER')
    db_password = os.getenv('DB_PASSWORD')
    db_host = os.getenv('DB_HOST')
    db_port = os.getenv('DB_PORT', 3306)
    db_name = os.getenv('DB_NAME')

    # Flask 앱에 DB URI 설정 (SQLAlchemy가 사용)
    app.config['SQLALCHEMY_DATABASE_URI'] = (
        f"mysql+pymysql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
    )
    # SQLAlchemy 이벤트 시스템 비활성화(필수는 아님, 워닝 방지)
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Blueprint 등록 (라우트 분리)
    from .routes.main import bp as main_bp
    app.register_blueprint(main_bp)

    # models/user.py에서 정의한 db 객체(=SQLAlchemy)와 Flask 앱 연결
    from .models.user import db
    db.init_app(app)

    # 설정이 완료된 Flask 앱 객체 반환
    return app