# insert_regions.py
from urllib.parse import quote_plus
import pandas as pd
from sqlalchemy import create_engine

# DB 연결 정보
DB_USER = "user"
DB_PASSWORD = quote_plus("uS3r_p@ss_2024")
DB_HOST = "localhost"
DB_PORT = "3306"
DB_NAME = "prod_predict"

DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(DATABASE_URL)

# 지역 목록 (이름과 행정구역 코드)
# 지역명 , 행정구역 코드
# 예시: 서울, 11000
regions = [
    {"name": "서울", "code": "11000"},
    {"name": "부산", "code": "26000"},
    {"name": "대구", "code": "27000"},
    {"name": "인천", "code": "28000"},
    {"name": "광주", "code": "29000"},
    {"name": "대전", "code": "30000"},
    {"name": "울산", "code": "31000"},
    {"name": "세종", "code": "36000"},
    {"name": "경기", "code": "41000"},
    {"name": "강원", "code": "42000"},
    {"name": "충북", "code": "43000"},
    {"name": "충남", "code": "44000"},
    {"name": "전북", "code": "45000"},
    {"name": "전남", "code": "46000"},
    {"name": "경북", "code": "47000"},
    {"name": "경남", "code": "48000"},
    {"name": "제주", "code": "50000"}
]

df = pd.DataFrame(regions)

# DataFrame을 MySQL의 'regions' 테이블에 추가
df.to_sql(name="regions", con=engine, if_exists="append", index=False)

print("지역 데이터 insert 완료!")

# 지역 목록 테이블
# CREATE TABLE regions (
#   id INT AUTO_INCREMENT PRIMARY KEY,                      -- 지역 고유 ID
#   name VARCHAR(100),                                      -- 지역명 (예: 서울, 부산)
#   code VARCHAR(20)                                        -- 지역 코드 (API 연동용)
# );