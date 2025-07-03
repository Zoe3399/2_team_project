from werkzeug.security import generate_password_hash, check_password_hash
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

    def set_password(self, password):
        """비밀번호를 해시화하여 저장합니다."""
        self.password_hash = generate_password_hash(password, method='pbkdf2:sha256', salt_length=8)

    def check_password(self, password):
        """해시된 비밀번호와 입력값을 비교합니다."""
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        """모델을 JSON 직렬화 가능한 dict로 변환합니다."""
        return {
            "id": self.id,
            "email": self.email,
            "is_verified": self.is_verified,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

    @staticmethod
    def from_dict(data):
        """JSON 요청으로부터 User 인스턴스를 생성할 때 사용합니다."""
        user = User(email=data.get("email"))
        user.set_password(data.get("password"))
        return user
    

class RegionData(db.Model):
    __tablename__ = 'region_data'
    id = db.Column(db.Integer, primary_key=True)
    region_id = db.Column(db.Integer)
    date = db.Column(db.Date)
    production_index = db.Column(db.Float)
    power_usage = db.Column(db.Float)
    export_amount = db.Column(db.Float)
    temperature_avg = db.Column(db.Float)
    precipitation = db.Column(db.Float)

class ForecastResult(db.Model):
    __tablename__ = 'forecast_results'
    id = db.Column(db.Integer, primary_key=True)
    region_id = db.Column(db.Integer)
    forecast_date = db.Column(db.Date)
    predicted_index = db.Column(db.Float)
    confidence = db.Column(db.Float)
    model_version = db.Column(db.String(20))