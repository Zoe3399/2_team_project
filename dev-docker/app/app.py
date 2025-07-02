# app 패키지에서 Flask 애플리케이션을 생성하는 create_app 함수 임포트
# 이 함수는 앱 설정, 확장기능 초기화, 블루프린트 등록 등을 담당
from app import create_app
import os  # 운영체제 환경변수 접근용

# create_app() 함수 호출하여 Flask 애플리케이션 인스턴스 생성
app = create_app()

# 이 파일이 직접 실행될 경우 (예: python app.py), Flask 앱을 실행
# 개발환경 여부는 .env의 FLASK_ENV 값으로 제어
if __name__ == '__main__':
    debug_mode = os.getenv("FLASK_ENV") == "development"  # 개발환경 여부 판단
    port = int(os.getenv("FLASK_PORT", 5000))  # .env에서 포트 지정 가능 (기본 5000)
    app.run(host="0.0.0.0", port=port, debug=debug_mode)