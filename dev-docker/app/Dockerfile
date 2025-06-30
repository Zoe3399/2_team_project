# 베이스 이미지: Python 3.10 slim 버전
FROM python:3.10-slim

# 작업 디렉토리를 /app으로 설정
WORKDIR /app

# 의존성 파일 복사 및 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 앱 전체 파일 복사
COPY . .

# Flask 실행 명령 지정
# FLASK_APP은 .env 또는 docker-compose.yml에서 지정됨을 가정
# Flask 개발 서버를 0.0.0.0으로 실행하여 외부 접속 가능하게 함
CMD ["flask", "run", "--host=0.0.0.0"]