

import smtplib
from email.mime.text import MIMEText
import os

def _send_email(to_email, subject, body):
    """
    실제 이메일을 발송하는 내부 함수입니다.
    이 함수는 SMTP 서버에 연결하여 메일을 보냅니다.
    환경변수(.env)에서 SMTP 서버 정보와 계정 정보를 불러옵니다.
    - to_email: 받을 사람의 이메일 주소
    - subject: 메일 제목
    - body: 메일 본문
    """
    # SMTP 서버 정보와 계정 정보를 환경변수에서 가져옵니다.
    SMTP_SERVER = os.getenv("MAIL_SMTP", "smtp.gmail.com")  # SMTP 서버 주소 (기본: gmail)
    SMTP_PORT = int(os.getenv("MAIL_PORT", "587"))          # SMTP 포트 (기본: 587)
    SMTP_USER = os.getenv("MAIL_USER")                      # 발신자 이메일 주소
    SMTP_PASSWORD = os.getenv("MAIL_PASS")                  # 발신자 앱 비밀번호

    # 이메일 메시지 객체를 만듭니다.
    msg = MIMEText(body)                                    # 본문 내용을 담습니다.
    msg["Subject"] = subject                               # 제목 입력
    msg["From"] = SMTP_USER                                # 보내는 사람
    msg["To"] = to_email                                   # 받는 사람

    try:
        # SMTP 서버에 연결합니다.
        smtp = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        smtp.starttls()  # TLS(암호화) 시작
        smtp.login(SMTP_USER, SMTP_PASSWORD)  # 로그인
        # 이메일을 실제로 발송합니다.
        smtp.sendmail(SMTP_USER, [to_email], msg.as_string())
        smtp.quit()  # 연결 종료
        print(f"[메일] {to_email} 메일 발송 성공")
        return True
    except Exception as e:
        # 오류가 발생하면 에러 메시지를 출력하고 False를 반환합니다.
        print(f"[메일] 발송 실패: {e}")
        return False

def send_verification_email(email, code):
    """
    인증번호를 이메일로 발송하는 함수입니다.
    회원가입, 비밀번호 찾기 등에서 인증번호를 보낼 때 사용합니다.
    - email: 받을 사람의 이메일 주소
    - code: 인증번호(문자열)
    """
    # 이메일 제목을 정합니다.
    subject = "이메일 인증번호 안내"
    # 이메일 본문 내용을 만듭니다. 인증번호를 포함시킵니다.
    body = f"인증번호는 [{code}] 입니다.\n\n본인 인증을 위해 해당 번호를 입력해 주세요."
    # 실제 메일 발송 함수 호출
    return _send_email(email, subject, body)