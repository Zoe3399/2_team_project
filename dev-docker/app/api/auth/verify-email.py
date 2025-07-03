from flask import Blueprint, request, jsonify
from flask_mail import Message  # type: ignore # flask_mail의 Message만 import
from app import db, mail  # db와 mail 인스턴스 import
from app.models.user import User, EmailVerification, db
import random
from datetime import datetime, timedelta

verify_email_bp = Blueprint('verify_email', __name__)

# 1. 이메일 인증코드 전송 API
@verify_email_bp.route('/api/auth/send-code', methods=['POST'])
def send_code():
    data = request.json
    email = data.get('email')
    if not email:
        return jsonify({'success': False, 'message': '이메일이 필요합니다.'}), 400

    # 인증코드 6자리 생성
    code = str(random.randint(100000, 999999))
    expires_at = datetime.utcnow() + timedelta(minutes=10)

    # DB에 코드 저장 (해당 이메일 user가 이미 있으면 업데이트, 없으면 새로 생성)
    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(email=email, is_verified=False, email_code=code, email_code_expires_at=expires_at)
        db.session.add(user)
    else:
        user.email_code = code
        user.email_code_expires_at = expires_at
    db.session.commit()

    # 인증코드 메일 전송
    try:
        msg = Message('[PowerMetric] 이메일 인증 코드', recipients=[email])
        msg.body = f"인증코드: {code}"
        mail.send(msg)  # 수정된 부분
        return jsonify({'success': True, 'message': '인증코드 전송 완료'}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': f'메일 전송 실패: {str(e)}'}), 500

# 2. 인증코드 확인 API
@verify_email_bp.route('/api/auth/verify-code', methods=['POST'])
def verify_code():
    data = request.json
    email = data.get('email')
    code = data.get('code')

    if not (email and code):
        return jsonify({'success': False, 'message': '이메일과 인증코드가 필요합니다.'}), 400

    user = User.query.filter_by(email=email).first()
    if user and user.email_code == code:
        if user.email_code_expires_at and datetime.utcnow() > user.email_code_expires_at:
            return jsonify({'success': False, 'message': '인증코드가 만료되었습니다.'}), 400
        user.is_verified = True
        db.session.commit()
        return jsonify({'success': True, 'message': '이메일 인증 성공'}), 200
    else:
        return jsonify({'success': False, 'message': '인증코드 불일치'}), 400