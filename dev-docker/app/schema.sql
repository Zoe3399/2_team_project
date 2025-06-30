-- 사용자 정보 테이블
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,                      -- 사용자 고유 ID
  email VARCHAR(100) UNIQUE NOT NULL,                     -- 사용자 이메일 (로그인용, 중복 불가)
  password_hash VARCHAR(255) NOT NULL,                    -- 암호화된 비밀번호
  created_at DATETIME,                                    -- 가입일시
  updated_at DATETIME                                     -- 정보 수정일시
);

-- 지역 목록 테이블
CREATE TABLE regions (
  id INT AUTO_INCREMENT PRIMARY KEY,                      -- 지역 고유 ID
  name VARCHAR(100),                                      -- 지역명 (예: 서울, 부산)
  code VARCHAR(20)                                        -- 지역 코드 (API 연동용)
);

-- 지역별 시계열 데이터 테이블 (전처리 완료된 실제 값)
CREATE TABLE region_data (
  id INT AUTO_INCREMENT PRIMARY KEY,                      -- 고유 ID
  region_id INT,                                          -- 참조: 지역 ID
  date DATE,                                              -- 기준 월
  production_index FLOAT,                                 -- 제조업 생산지수
  power_usage FLOAT,                                      -- 전력 사용량 (단위: MWh)
  export_amount FLOAT,                                    -- 수출액 (단위: 억원)
  temperature_avg FLOAT,                                  -- 평균기온 (선택 항목)
  precipitation FLOAT,                                    -- 강수량 (선택 항목)
  created_at DATETIME,                                    -- 입력일시
  FOREIGN KEY (region_id) REFERENCES regions(id)          -- 지역 참조키
);

-- 예측 결과 테이블
CREATE TABLE forecast_results (
  id INT AUTO_INCREMENT PRIMARY KEY,                      -- 고유 ID
  region_id INT,                                          -- 참조: 지역 ID
  forecast_date DATE,                                     -- 예측 대상 월
  predicted_index FLOAT,                                  -- 예측된 생산지수 값
  confidence FLOAT,                                       -- 예측 신뢰도 (0~1 또는 %)
  model_version VARCHAR(20),                              -- 예측 모델 버전 (예: "prophet_v1")
  created_at DATETIME,                                    -- 예측 생성일시
  FOREIGN KEY (region_id) REFERENCES regions(id)          -- 지역 참조키
);

-- 즐겨찾기 테이블
CREATE TABLE favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,                      -- 고유 ID
  user_id INT,                                            -- 참조: 사용자 ID
  region_id INT,                                          -- 참조: 지역 ID
  created_at DATETIME,                                    -- 즐겨찾기 등록일시
  FOREIGN KEY (user_id) REFERENCES users(id),             -- 사용자 참조키
  FOREIGN KEY (region_id) REFERENCES regions(id)          -- 지역 참조키
);

-- 인사이트 메시지 테이블 (자동 생성된 자연어 해석)
CREATE TABLE insight_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,                      -- 고유 ID
  region_id INT,                                          -- 참조: 지역 ID
  date DATE,                                              -- 기준 시점 (월 단위)
  message TEXT,                                           -- 인사이트 메시지 (자연어)
  message_type VARCHAR(30),                               -- 메시지 유형 (예: 상승, 하락, 이상징후 등)
  source VARCHAR(20),                                     -- 메시지 생성 출처 (예: 예측모델, 기초통계)
  created_at DATETIME,                                    -- 생성일시
  FOREIGN KEY (region_id) REFERENCES regions(id)          -- 지역 참조키
);


-- 인덱스 최적화 쿼리 추가
-- 중복 데이터 방지
CREATE UNIQUE INDEX idx_region_date ON region_data (region_id, date);

-- 예측 데이터 중복 방지
CREATE UNIQUE INDEX idx_forecast_region_date ON forecast_results (region_id, forecast_date);