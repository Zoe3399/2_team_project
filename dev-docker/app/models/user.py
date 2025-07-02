from flask_sqlalchemy import SQLAlchemy
from flask import current_app

# SQLAlchemy 인스턴스 선언
db = SQLAlchemy()

# 사용자 테이블 정의
class User(db.Model):
    __tablename__ = 'users'  # 테이블 이름

    id = db.Column(db.Integer, primary_key=True)  # 기본 키
    email = db.Column(db.String(100), unique=True, nullable=False)  # 로그인용 이메일 (중복 불가)
    password_hash = db.Column(db.String(255), nullable=False)  # 해시된 비밀번호 저장
    is_verified = db.Column(db.Boolean, default=False)  # 이메일 인증 여부
    created_at = db.Column(db.DateTime, server_default=db.func.now())  # 가입일시
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())  # 수정일시