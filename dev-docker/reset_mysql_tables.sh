#!/bin/bash

# MySQL 접속 정보
CONTAINER_NAME="app-db-1"
MYSQL_USER="user"
MYSQL_PASSWORD="uS3r_p@ss_2024"
DB_NAME="prod_predict"
SCHEMA_FILE="./app/schema.sql"

# 함수: 사용자에게 yes/no 입력 받기
ask_confirmation() {
  while true; do
    echo -e "\n⚠️  테이블이 존재하여 테이블을 삭제해야합니다."
    echo -e "🧨 테이블 삭제 시에는 DB에 있는 정보가 전부 삭제됩니다."
    read -p "삭제를 진행하시겠습니까? (yes or no): " yn
    case $yn in
        [Yy][Ee][Ss] ) return 0;;
        [Nn][Oo] ) echo "⛔ 테이블 수정을 취소하였습니다."; exit;;
        * ) echo "❗ yes 또는 no 로 답변해 주세요.";;
    esac
  done
}

# 테이블 존재 여부 확인 쿼리
check_tables=$(docker exec $CONTAINER_NAME mysql -u $MYSQL_USER -p$MYSQL_PASSWORD -D $DB_NAME -e "SHOW TABLES;" | wc -l)

# 테이블이 존재하면 삭제 여부 묻기
if [ $check_tables -gt 1 ]; then
  ask_confirmation

  echo -e "\n🗑️ 기존 테이블 삭제 중..."
  docker exec -i $CONTAINER_NAME mysql -u $MYSQL_USER -p$MYSQL_PASSWORD -D $DB_NAME <<EOF
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS 
  news_insights,
  news_articles,
  insight_messages,
  favorites,
  forecast_results,
  region_data,
  regions,
  users;
SET FOREIGN_KEY_CHECKS = 1;
EOF
fi

# 새 테이블 생성
echo -e "\n📦 스키마 적용 중..."
docker exec -i $CONTAINER_NAME mysql -u $MYSQL_USER -p$MYSQL_PASSWORD $DB_NAME < $SCHEMA_FILE

echo -e "\n✅ 완료: 테이블이 성공적으로 생성되었습니다!"
