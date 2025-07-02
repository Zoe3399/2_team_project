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
import random
import string

# 사용자 인증 관련 라우트들을 묶는 블루프린트 객체 생성
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

def generate_verification_code(length=6):
    """
    6자리 영숫자 인증 코드를 생성하는 함수입니다.
    """
    return ''.join(random.choices(string.digits, k=length))

def send_email_stub(email: str, subject: str, body: str):
    """
    실제 메일 발송 기능을 대체하는 예시 함수입니다.
    추후 서비스에 맞게 구현 필요합니다.
    """
    print(f"[메일 발송] To: {email}, Subject: {subject}, Body: {body}")

def send_verification_code(email: str):
    """
    이메일 인증번호 생성, DB 저장, 메일 발송을 처리하는 함수입니다.
    - 인증 코드는 6자리 숫자입니다.
    - DB의 User 모델에 verification_code 및 code_expiration 필드를 추가했다고 가정합니다.
    """
    code = generate_verification_code()
    user = User.query.filter_by(email=email).first()
    if not user:
        return False, "등록되지 않은 이메일입니다."

    # 인증 코드 및 만료 시간(10분 후) 저장
    user.verification_code = code
    user.code_expiration = datetime.datetime.utcnow() + datetime.timedelta(minutes=10)
    db.session.commit()

    # 인증 코드 메일 발송 (예시)
    subject = "이메일 인증 코드 발송"
    body = f"인증 코드는 {code} 입니다. 10분 내에 입력해주세요."
    send_email_stub(email, subject, body)

    return True, "인증 코드가 발송되었습니다."

def verify_code(email: str, code: str):
    """
    이메일과 인증 코드를 검증하는 함수입니다.
    - 코드가 일치하고 만료되지 않았으면 True 반환
    """
    user = User.query.filter_by(email=email).first()
    if not user:
        return False, "등록되지 않은 이메일입니다."

    if not user.verification_code or not user.code_expiration:
        return False, "인증 코드가 없습니다. 코드를 요청하세요."

    if user.verification_code != code:
        return False, "인증 코드가 일치하지 않습니다."

    if datetime.datetime.utcnow() > user.code_expiration:
        return False, "인증 코드가 만료되었습니다."

    return True, "인증 코드가 확인되었습니다."

def reset_password(email: str, code: str, new_password: str):
    """
    인증 코드를 검증 후 비밀번호를 갱신하는 함수입니다.
    """
    valid, message = verify_code(email, code)
    if not valid:
        return False, message

    user = User.query.filter_by(email=email).first()
    if not user:
        return False, "등록되지 않은 이메일입니다."

    # 비밀번호 길이 검사 (8~20자)
    if len(new_password) < 8 or len(new_password) > 20:
        return False, "비밀번호는 8자 이상 20자 이하여야 합니다."

    # 비밀번호 해시 갱신
    user.password_hash = generate_password_hash(new_password)
    # 인증 완료 상태 업데이트 (예: is_verified 필드)
    user.is_verified = True
    # 인증 코드 초기화
    user.verification_code = None
    user.code_expiration = None
    db.session.commit()

    return True, "비밀번호가 성공적으로 변경되었습니다."

def kakao_oauth_login(access_token: str, kakao_user_id: str):
    """
    카카오 OAuth 로그인/회원가입 처리 함수입니다.
    - access_token 및 kakao_user_id를 받아 카카오 API 검증 후 사용자 정보 획득 (예시)
    - 사용자 DB에서 kakao_user_id 기반으로 조회 후 없으면 신규 생성
    - JWT 토큰 생성 후 반환
    """
    # 실제 카카오 API 호출 및 검증은 생략, 예시 사용자 정보 생성
    # 예시: kakao_user_id가 unique한 키로 사용됨
    # 여기서는 간단히 DB 조회 및 생성 처리만 구현

    user = User.query.filter_by(kakao_user_id=kakao_user_id).first()
    if not user:
        # 신규 사용자 생성
        user = User(
            email=f"{kakao_user_id}@kakao.com",  # 이메일이 없으면 임의 생성
            password_hash=generate_password_hash(os.urandom(16).hex()),  # 랜덤 비밀번호 해시
            kakao_user_id=kakao_user_id,
            is_verified=True
        )
        db.session.add(user)
        db.session.commit()

    # JWT 토큰 생성: 유효기간 24시간
    token = jwt.encode(
        {
            "user_id": user.id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        },
        os.getenv('SECRET_KEY'),
        algorithm="HS256"
    )

    return token, user

# 사용자 회원가입 API
@auth_bp.route('/signup', methods=['POST'])
def register():
    """
    회원가입 처리 API
    """
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"success": False, "message": "이메일과 비밀번호를 모두 입력해야 합니다."}), 400

    if "@" not in email or "." not in email:
        return jsonify({"success": False, "message": "올바른 이메일 형식이 아닙니다."}), 400

    if len(password) < 8 or len(password) > 20:
        return jsonify({"success": False, "message": "비밀번호는 8자 이상 20자 이하여야 합니다."}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"success": False, "message": "이미 등록된 이메일입니다."}), 409

    new_user = User.from_dict(data)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"success": True, "user": new_user.to_dict()}), 201

# 사용자 로그인 API
@auth_bp.route('/login', methods=['POST'])
def login():
    """
    로그인 처리 API
    """
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"success": False, "message": "이메일과 비밀번호를 입력하세요."}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"success": False, "message": "등록되지 않은 이메일입니다."}), 401

    if not check_password_hash(user.password_hash, password):
        return jsonify({"success": False, "message": "비밀번호가 일치하지 않습니다."}), 401

    token = jwt.encode(
        {
            "user_id": user.id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        },
        os.getenv('SECRET_KEY'),
        algorithm="HS256"
    )

    return jsonify({"success": True, "token": token, "user": user.to_dict()}), 200

# JWT 토큰 기반 사용자 정보 확인 API
@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    """
    JWT 토큰으로 인증된 사용자 정보를 반환하는 API
    """
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"success": False, "message": "인증 토큰이 필요합니다."}), 401

    try:
        payload = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=["HS256"])
        user_id = payload['user_id']
        user = User.query.get(user_id)
        if not user:
            return jsonify({"success": False, "message": "사용자를 찾을 수 없습니다."}), 404

        # 전체 사용자 정보 반환
        return jsonify({
            "success": True,
            "user": user.to_dict()
        })
    except jwt.ExpiredSignatureError:
        return jsonify({"success": False, "message": "토큰이 만료되었습니다."}), 401
    except jwt.InvalidTokenError:
        return jsonify({"success": False, "message": "유효하지 않은 토큰입니다."}), 401

# 이메일 인증번호 발송 API
@auth_bp.route('/send-code', methods=['POST'])
def send_code():
    """
    이메일로 인증 코드를 생성하여 발송하는 API
    요청 JSON: { "email": "user@example.com" }
    """
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"success": False, "message": "이메일을 입력하세요."}), 400

    success, message = send_verification_code(email)
    status_code = 200 if success else 400
    return jsonify({"success": success, "message": message}), status_code

# 인증번호 검증 API
@auth_bp.route('/verify-code', methods=['POST'])
def verify_code_route():
    """
    이메일과 인증 코드를 검증하는 API
    요청 JSON: { "email": "user@example.com", "code": "123456" }
    """
    data = request.get_json()
    email = data.get('email')
    code = data.get('code')

    if not email or not code:
        return jsonify({"success": False, "message": "이메일과 코드를 모두 입력하세요."}), 400

    valid, message = verify_code(email, code)
    status_code = 200 if valid else 400
    if valid:
        # 인증 성공 시 is_verified 필드 업데이트
        user = User.query.filter_by(email=email).first()
        user.is_verified = True
        db.session.commit()
    return jsonify({"success": valid, "message": message}), status_code

# 비밀번호 재설정 API
@auth_bp.route('/reset-password', methods=['POST'])
def reset_password_route():
    """
    인증번호 검증 후 비밀번호를 재설정하는 API
    요청 JSON: { "email": "user@example.com", "code": "123456", "new_password": "newpass123" }
    """
    data = request.get_json()
    email = data.get('email')
    code = data.get('code')
    new_password = data.get('new_password')

    if not email or not code or not new_password:
        return jsonify({"success": False, "message": "이메일, 코드, 새 비밀번호를 모두 입력하세요."}), 400

    success, message = reset_password(email, code, new_password)
    status_code = 200 if success else 400
    return jsonify({"success": success, "message": message}), status_code

# 카카오 OAuth 로그인/회원가입 API
@auth_bp.route('/kakao', methods=['POST'])
def kakao_login():
    """
    카카오 OAuth 로그인 또는 회원가입 처리 API
    요청 JSON: { "access_token": "...", "user_id": "..." }
    """
    data = request.get_json()
    access_token = data.get('access_token')
    kakao_user_id = data.get('user_id')

    if not access_token or not kakao_user_id:
        return jsonify({"success": False, "message": "access_token과 user_id를 모두 입력하세요."}), 400

    # 실제 카카오 API 검증은 생략, 예시 함수 호출
    token, user = kakao_oauth_login(access_token, kakao_user_id)

    return jsonify({"success": True, "token": token, "user": user.to_dict()}), 200
