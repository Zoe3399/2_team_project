# 베이스 이미지: Python 3.10 slim 버전
FROM python:3.10-slim

# mysql-client 설치 추가
RUN apt-get update && apt-get install -y default-mysql-client netcat-openbsd && rm -rf /var/lib/apt/lists/*

# 작업 디렉토리를 /app으로 설정
WORKDIR /app

# 의존성 파일 복사 및 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install cryptography

# 앱 전체 파일 복사
COPY . .
# DB_insert는 이미 앱 내부에 있으므로 복사 생략
# reset_mysql_tables.sh 복사 및 실행 권한 부여는 깃허브로 진행 완료

# Flask 실행 명령 지정
ENTRYPOINT ["sh", "-c", "./DB_insert/scripts/reset_mysql_tables.sh && flask run --host=0.0.0.0"]
ENV PYTHONPATH=/app