# app 패키지에서 Flask 애플리케이션을 생성하는 create_app 함수 임포트
# 이 함수는 앱 설정, 확장기능 초기화, 블루프린트 등록 등을 담당
from app import create_app

# create_app() 함수 호출하여 Flask 애플리케이션 인스턴스 생성
# 환경 설정에 따라 개발 또는 운영 모드로 앱이 구성됨
app = create_app()

# 이 파일이 직접 실행될 경우 (예: python run.py), Flask 앱을 시작
# 호스트를 0.0.0.0으로 설정하면 외부에서도 접속 가능
# 포트는 기본 5000번을 사용
# ⚠️ 운영 배포 시에는 debug=True 설정을 반드시 제거할 것
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)