# """
# auth.py - 사용자 인증 관련 API 라우트 정의
# 엔드포인트는 /api/auth/* 로 시작합니다 (url_prefix에 의해)
# """
# from flask import Blueprint, request, jsonify, current_app
# from werkzeug.security import generate_password_hash, check_password_hash
# from app.models.user import User, db
# from flask_mail import Message
# from app import mail
# import jwt
# import datetime
# import os

# auth_bp = Blueprint('auth', __name__)

# # 회원가입
# @auth_bp.route('/register', methods=['POST'])
# def register():
#     data = request.get_json()
#     email = data.get('email')
#     password = data.get('password')

#     if not email or not password:
#         return jsonify({"success": False, "message": "이메일과 비밀번호를 모두 입력해야 합니다."}), 400
#     if "@" not in email or "." not in email:
#         return jsonify({"success": False, "message": "올바른 이메일 형식이 아닙니다."}), 400
#     if len(password) < 6:
#         return jsonify({"success": False, "message": "비밀번호는 6자 이상이어야 합니다."}), 400
#     if User.query.filter_by(email=email).first():
#         return jsonify({"success": False, "message": "이미 등록된 이메일입니다."}), 409

#     hashed_pw = generate_password_hash(password)
#     new_user = User(email=email, password_hash=hashed_pw)
#     db.session.add(new_user)
#     db.session.commit()
#     return jsonify({"success": True, "message": "회원가입이 완료되었습니다."}), 201

# # 이메일 인증 요청 (회원가입 후 이메일 인증 메일 발송)
# @auth_bp.route('/send-verify-email', methods=['POST'])
# def send_verify_email():
#     """
#     사용자가 입력한 이메일로 인증 메일을 발송하는 엔드포인트
#     body: { "email": "xxx@xxx.com" }
#     """
#     data = request.get_json()
#     email = data.get('email')
#     if not email:
#         return jsonify({"success": False, "message": "이메일이 필요합니다."}), 400

#     # 인증 토큰 생성 (jwt)
#     secret = os.getenv('SECRET_KEY') or current_app.config.get('SECRET_KEY')
#     token = jwt.encode(
#         {
#             "email": email,
#             "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
#         },
#         secret,
#         algorithm="HS256"
#     )

#     # 실제 이메일 발송
#     verify_link = f"http://localhost:5173/verify-email?token={token}"
#     msg = Message(
#         subject="[mail-sender] 이메일 인증 요청",
#         recipients=[email],
#         sender="dororong69@gmail.com",
#         body=f"아래 링크를 클릭해서 이메일 인증을 완료해주세요.\n\n{verify_link}\n\n본 메일은 발송 전용입니다."
#     )
#     try:
#         mail.send(msg)
#         return jsonify({"success": True, "message": "인증 메일이 발송되었습니다."}), 200
#     except Exception as e:
#         return jsonify({"success": False, "message": f"메일 발송 실패: {str(e)}"}), 500

# # 로그인
# @auth_bp.route('/login', methods=['POST'])
# def login():
#     data = request.get_json()
#     email = data.get('email')
#     password = data.get('password')

#     if not email or not password:
#         return jsonify({"success": False, "message": "이메일과 비밀번호를 입력하세요."}), 400
#     user = User.query.filter_by(email=email).first()
#     if not user:
#         return jsonify({"success": False, "message": "등록되지 않은 이메일입니다."}), 401
#     if not check_password_hash(user.password_hash, password):
#         return jsonify({"success": False, "message": "비밀번호가 일치하지 않습니다."}), 401

#     token = jwt.encode(
#         {"user_id": user.id, "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)},
#         os.getenv('SECRET_KEY') or current_app.config.get('SECRET_KEY'),
#         algorithm="HS256"
#     )
#     return jsonify({"success": True, "token": token}), 200

# # JWT 토큰으로 내 정보 확인
# @auth_bp.route('/me', methods=['GET'])
# def get_current_user():
#     token = request.headers.get('Authorization')
#     if not token:
#         return jsonify({"success": False, "message": "인증 토큰이 필요합니다."}), 401
#     try:
#         payload = jwt.decode(token, os.getenv('SECRET_KEY') or current_app.config.get('SECRET_KEY'), algorithms=["HS256"])
#         user_id = payload['user_id']
#         user = User.query.get(user_id)
#         if not user:
#             return jsonify({"success": False, "message": "사용자를 찾을 수 없습니다."}), 404
#         return jsonify({"success": True, "user": {"id": user.id, "email": user.email}})
#     except jwt.ExpiredSignatureError:
#         return jsonify({"success": False, "message": "토큰이 만료되었습니다."}), 401
#     except jwt.InvalidTokenError:
#         return jsonify({"success": False, "message": "유효하지 않은 토큰입니다."}), 401


# # 이메일 인증 토큰 검증 및 사용자 인증 처리
# @auth_bp.route('/verify-email', methods=['GET'])
# def verify_email():
#     """
#     사용자가 이메일 인증 링크를 클릭했을 때 토큰을 검증하고,
#     인증에 성공하면 DB의 is_verified 값을 True로 변경합니다.
#     쿼리 파라미터: ?token=...
#     """
#     token = request.args.get('token')
#     if not token:
#         return jsonify({"success": False, "message": "토큰이 없습니다."}), 400

#     try:
#         secret = os.getenv('SECRET_KEY') or current_app.config.get('SECRET_KEY')
#         payload = jwt.decode(token, secret, algorithms=["HS256"])
#         email = payload['email']
#         user = User.query.filter_by(email=email).first()
#         if not user:
#             return jsonify({"success": False, "message": "존재하지 않는 사용자입니다."}), 404
#         if user.is_verified:
#             return jsonify({"success": True, "message": "이미 인증된 이메일입니다."}), 200

#         user.is_verified = True
#         db.session.commit()
#         return jsonify({"success": True, "message": "이메일 인증이 완료되었습니다."}), 200

#     except jwt.ExpiredSignatureError:
#         return jsonify({"success": False, "message": "토큰이 만료되었습니다."}), 400
#     except jwt.InvalidTokenError:
#         return jsonify({"success": False, "message": "유효하지 않은 토큰입니다."}), 400
#     except Exception as e:
#         return jsonify({"success": False, "message": f"알 수 없는 오류: {str(e)}"}), 500