import os
from urllib.parse import quote_plus

class Config:
    # Flask 앱의 보안 키
    SECRET_KEY = os.environ.get('SECRET_KEY', 'default-secret-key')

    # 환경변수에서 DB 접속 정보 읽기
    DB_USER = os.environ.get('DB_USER', 'user')
    DB_PASSWORD = quote_plus(os.environ.get('DB_PASSWORD', 'uS3r_p@ss_2024'))  # 특수문자 인코딩
    DB_HOST = os.environ.get('DB_HOST', 'db')
    DB_PORT = os.environ.get('DB_PORT', '3306')
    DB_NAME = os.environ.get('DB_NAME', 'prod_predict')

    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # 이메일 발송 관련 설정 (Flask-Mail)
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME', 'dororong69@gmail.com')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD', 'gmno eojw dfhc aesr')
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER', 'dororong69@gmail.com')