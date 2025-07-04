import pandas as pd
from sqlalchemy import create_engine
from urllib.parse import quote_plus

# DB 연결 정보
DB_USER = "user"
DB_PASSWORD = quote_plus("uS3r_p@ss_2024")
DB_HOST = "db"
DB_PORT = "3306"
DB_NAME = "prod_predict"

DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(DATABASE_URL)

# 지역명 → region_id 매핑
region_name_to_id = {
    "서울": 1, "부산": 2, "대구": 3, "인천": 4, "광주": 5, "대전": 6, "울산": 7,
    "세종": 8, "경기": 9, "강원": 10, "충북": 11, "충남": 12, "전북": 13, "전남": 14,
    "경북": 15, "경남": 16, "제주": 17
}

# CSV 파일 읽기
df = pd.read_csv("DB_insert/data/predicted_2025_567_csv.csv")

# 컬럼명 확인용 출력 추가 (디버깅용)
print("컬럼명 확인:", df.columns)

# 컬럼명 변경 (파일 내 실제 컬럼명에 맞게 조정)
df = df.rename(columns={
    "region": "region_name",
    "month": "forecast_date",
    "prod_index": "predicted_index",
    "util_rate": "confidence",
    "model_version": "model_version"  # Add manually if not present in CSV
})

if "model_version" not in df.columns:
    df["model_version"] = "v1"

df["region_id"] = df["region_name"].map(region_name_to_id)

# 날짜 형식 변환
df["forecast_date"] = pd.to_datetime(df["forecast_date"], errors="coerce").dt.date

# 필요한 컬럼 정리 및 결측 제거
df = df[[
    "region_id",
    "forecast_date",
    "predicted_index",
    "confidence",
    "model_version"
]].dropna()

# DB insert
df.to_sql(name="forecast_results", con=engine, if_exists="append", index=False)

print("예측 결과 forecast_results 테이블에 insert 완료!")