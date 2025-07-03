# 인증 코드 생성, 재전송 및 카카오 로그인 처리를 위한 API 라우트
from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash
from app.models.user import User, EmailVerification, db
import random
import string
import datetime
import jwt  # type: ignore
from app.api.auth.verify_email import verify_and_register  # type: ignore

# Blueprint 객체 생성: register_api 라는 이름으로 라우팅 그룹화
register_bp = Blueprint('register_api', __name__)

@register_bp.route('/send-code', methods=['POST', 'OPTIONS'])
def send_verification_code():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({"success": False, "message": "이메일과 비밀번호가 필요합니다."}), 400

    # 이미 등록된 이메일인지 확인
    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({"success": False, "message": "이미 가입된 이메일입니다."}), 400

    # 이메일 인증 요청 처리 (verify_email.py 내부에서 처리)
    return verify_and_register(email, password)

@register_bp.route('/kakao', methods=['POST', 'OPTIONS'])
def kakao_login():
    # 요청 본문 JSON에서 social_id 및 name 추출
    data = request.get_json()
    social_id = data.get('social_id')  # 카카오 고유 사용자 ID
    name = data.get('name')  # 이름도 추출 필요

    if not social_id:
        return jsonify({"success": False, "message": "social_id가 필요합니다."}), 400

    # 기존 카카오 사용자 조회
    user = User.query.filter_by(provider='kakao', social_id=social_id).first()

    if not user:
        # 신규 가입: 이메일 정보 없음, 비밀번호 해시 없음, 인증 완료(true)
        user = User(
            email=None,
            password_hash=None,
            is_verified=True,
            provider='kakao',
            social_id=social_id,
            name=name,
            role='user'
        )
        db.session.add(user)
        db.session.commit()

    # 로그인 시각 업데이트
    user.last_login = datetime.datetime.utcnow()
    db.session.commit()

    # JWT 토큰 생성: 유효기간 24시간
    token = jwt.encode(
        {
            "user_id": user.id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        },
        current_app.config.get('SECRET_KEY'),
        algorithm="HS256"
    )

    return jsonify({"success": True, "token": token}), 200