# ⚠️ 이 파일은 수동 초기화 용도입니다.
# CI/CD 자동 설정이 되지 않았을 때 실행하세요.
# 실행 후에는 삭제하거나 무시해도 됩니다.

# 아래 주석된 코드 블럭을 해제해서 실행 가능하게 설정할 수 있음
# 목적: Flask 애플리케이션에서 DB 테이블을 초기화하기 위한 스크립트

from app import create_app  # create_app 함수로 Flask 앱 생성
from app.models.user import db  # db 인스턴스 불러오기

# Flask 앱 생성
app = create_app()

# Flask 앱 컨텍스트 내에서 작업 수행
with app.app_context():
    print("📦 데이터베이스 테이블을 생성 중입니다...")
    # SQLAlchemy 모델 기반으로 테이블 자동 생성 (CI/CD 미사용 시 수동 실행)
    db.create_all()  
    print("✅ 완료: 모든 테이블이 성공적으로 생성되었습니다.")  

# SQL 스크립트를 통한 테이블 생성이 필요한 경우
# 아래 블럭을 주석 해제하고 실행하세요.
# ⚠️ 이 블럭은 일회성 실행용입니다.
# - schema.sql 파일은 현재 디렉토리에 있어야 합니다.
# - SQLAlchemy의 엔진을 사용해 SQL 쿼리를 순차 실행합니다.
# - CI/CD에서 init.sql로 자동 실행되는 구조라면 생략 가능
# ⚠️ 실행이 끝나면 이 블럭 전체는 다시 주석 처리하거나 삭제하세요
# (init_db.py는 일회성 실행 스크립트입니다).
import sqlalchemy  # type: ignore
with open("schema.sql", "r", encoding="utf-8") as f:
    sql = f.read()
    engine = db.get_engine()
    with engine.connect() as conn:
        for statement in sql.split(";"):
            stmt = statement.strip()
            if stmt:
                conn.execute(sqlalchemy.text(stmt))