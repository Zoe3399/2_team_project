"""
auth.py - 사용자 인증 관련 API 라우트 정의

이 파일은 회원가입, 로그인, JWT 토큰 검증 등 인증 관련 기능들을 제공합니다.
- 엔드포인트는 /api/auth/* 로 시작합니다 (url_prefix에 의해)
"""

from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from app.models.user import User, db
import jwt  # type: ignore
import datetime
import os

# 사용자 인증 관련 라우트들을 묶는 블루프린트 객체 생성
auth_bp = Blueprint('auth', __name__)

# 사용자 회원가입 API
@auth_bp.route('/api/register', methods=['POST'])
def register():
    # JSON 요청 본문에서 이메일과 비밀번호 추출
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # 예외 처리: 필수 항목 누락
    if not email or not password:
        return jsonify({"success": False, "message": "이메일과 비밀번호를 모두 입력해야 합니다."}), 400

    # 이메일 형식 유효성 검사
    if "@" not in email or "." not in email:
        return jsonify({"success": False, "message": "올바른 이메일 형식이 아닙니다."}), 400

    # 비밀번호 최소 길이 검사
    if len(password) < 6:
        return jsonify({"success": False, "message": "비밀번호는 6자 이상이어야 합니다."}), 400

    # 이메일 중복 여부 확인
    if User.query.filter_by(email=email).first():
        return jsonify({"success": False, "message": "이미 등록된 이메일입니다."}), 409

    # 비밀번호 해시화 후 사용자 생성
    hashed_pw = generate_password_hash(password)
    new_user = User(email=email, password_hash=hashed_pw)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"success": True, "message": "회원가입이 완료되었습니다."}), 201

# 사용자 로그인 API
@auth_bp.route('/api/login', methods=['POST'])
def login():
    # JSON 요청 본문에서 이메일과 비밀번호 추출
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # 예외 처리: 필수 항목 누락
    if not email or not password:
        return jsonify({"success": False, "message": "이메일과 비밀번호를 입력하세요."}), 400

    # 사용자 존재 여부 확인
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"success": False, "message": "등록되지 않은 이메일입니다."}), 401

    # 비밀번호 검증
    if not check_password_hash(user.password_hash, password):
        return jsonify({"success": False, "message": "비밀번호가 일치하지 않습니다."}), 401

    # JWT 토큰 생성: 유효기간 24시간
    token = jwt.encode(
        {
            "user_id": user.id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        },
        os.getenv('SECRET_KEY'),
        algorithm="HS256"
    )

    return jsonify({"success": True, "token": token}), 200

# JWT 토큰 기반 사용자 정보 확인 API
@auth_bp.route('/api/me', methods=['GET'])
def get_current_user():
    # Authorization 헤더에서 토큰 추출
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"success": False, "message": "인증 토큰이 필요합니다."}), 401

    try:
        # 토큰 디코딩 및 사용자 정보 추출
        payload = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=["HS256"])
        user_id = payload['user_id']
        user = User.query.get(user_id)
        if not user:
            return jsonify({"success": False, "message": "사용자를 찾을 수 없습니다."}), 404

        return jsonify({
            "success": True,
            "user": {
                "id": user.id,
                "email": user.email
            }
        })
    except jwt.ExpiredSignatureError:
        return jsonify({"success": False, "message": "토큰이 만료되었습니다."}), 401
    except jwt.InvalidTokenError:
        return jsonify({"success": False, "message": "유효하지 않은 토큰입니다."}), 401
