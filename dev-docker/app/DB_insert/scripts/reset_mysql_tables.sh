#!/bin/bash

# MySQL 접속 정보
MYSQL_USER="user"
MYSQL_PASSWORD="uS3r_p@ss_2024"
DB_NAME="prod_predict"
SCHEMA_FILE="/app/DB_insert/scripts/schema.sql"

# 테이블 존재 여부 확인 쿼리 (기존 방식은 docker exec 사용 -> 컨테이너 내 실행으로 수정)
check_tables=$(mysql -u $MYSQL_USER -p$MYSQL_PASSWORD -D $DB_NAME -e "SHOW TABLES;" | wc -l)

# 테이블이 존재하면 삭제
if [ $check_tables -gt 1 ]; then
  echo -e "\n🗑️ 기존 테이블 삭제 중..."
  mysql -u $MYSQL_USER -p$MYSQL_PASSWORD -D $DB_NAME <<EOF
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS 
  news_insights,
  news_articles,
  insight_messages,
  favorites,
  forecast_results,
  region_data,
  regions,
  users,
  email_verification,
  password_reset;
SET FOREIGN_KEY_CHECKS = 1;
EOF
fi

# 새 테이블 생성
echo -e "\n 스키마 적용 중..."
mysql -u $MYSQL_USER -p$MYSQL_PASSWORD $DB_NAME < $SCHEMA_FILE

echo -e "\n 완료: 테이블이 성공적으로 생성되었습니다!"

# 데이터 insert 스크립트 실행 (명시적으로 직접 호출)
echo -e "\n예측 및 지역 데이터 삽입 중..."
python3 DB_insert/scripts/insert_regions.py
python3 DB_insert/scripts/insert_region_data.py
python3 DB_insert/scripts/insert_forecast_results.py
echo -e "\n데이터 삽입 완료!"
