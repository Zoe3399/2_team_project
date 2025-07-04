# insert_region_data.py
from urllib.parse import quote_plus
import pandas as pd
from sqlalchemy import create_engine
import pymysql

# DB 연결 정보
DB_USER = "user"
DB_PASSWORD = quote_plus("uS3r_p@ss_2024")
DB_HOST = "db"
DB_PORT = "3306"
DB_NAME = "prod_predict"

DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(DATABASE_URL)

# 지역 코드 매핑 (DB에 등록된 순서 기준)
region_name_to_id = {
    "서울": 1,
    "부산": 2,
    "대구": 3,
    "인천": 4,
    "광주": 5,
    "대전": 6,
    "울산": 7,
    "세종": 8,
    "경기": 9,
    "강원": 10,
    "충북": 11,
    "충남": 12,
    "전북": 13,
    "전남": 14,
    "경북": 15,
    "경남": 16,
    "제주": 17
}

# CSV 읽기
df = pd.read_csv("DB_insert/data/option1_merged_exclude_sejong.csv")

# 컬럼명 변경 및 선택
df = df.rename(columns={
    "month": "date",
    "region": "region_name",
    "prod_index": "production_index",
    "power_kwh_industry": "power_usage",
    "export_amount": "export_amount",
    "temp_avg": "temperature_avg",
    "precipitation": "precipitation"
})

df["region_id"] = df["region_name"].map(region_name_to_id)

# power_usage 숫자형으로 변환 (쉼표 제거 후 float 변환)
df["power_usage"] = df["power_usage"].replace({",": ""}, regex=True).astype(float)

# 필요한 컬럼만 남기기
df = df[[
    "region_id",
    "date",
    "production_index",
    "power_usage",
    "export_amount",
    "temperature_avg",
    "precipitation"
]]

# DB에 insert
df.to_sql(name="region_data", con=engine, if_exists="append", index=False)

print(" 지역별 시계열 데이터 insert 완료!")