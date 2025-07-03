-- [참고] 이 파일은 dev-docker/reset_mysql_tables.sh에서 참조됩니다.
-- 실행 위치 기준: ./dev-docker/schema.sql

-- 기존 테이블 삭제 (존재할 경우)
-- DROP TABLE IF EXISTS
--   password_reset,
--   email_verification,
--   insight_messages,
--   favorites,
--   forecast_results,
--   region_data,
--   regions,
--   users;

-- 사용자 정보 테이블
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,                                -- 사용자 고유 ID
  email VARCHAR(100) UNIQUE,                                        -- 사용자 이메일 (local 회원만 값 존재)
  password_hash VARCHAR(255),                                       -- 암호화된 비밀번호 (local 회원만 값 존재)
  is_verified BOOLEAN DEFAULT FALSE,                                -- 이메일 인증 여부 (local 회원만 해당)
  provider VARCHAR(20),                                             -- 가입 방식(local, kakao 등)
  social_id VARCHAR(50) DEFAULT NULL COMMENT '소셜 로그인 고유 ID',       -- 소셜 로그인 고유 ID
  name VARCHAR(100) DEFAULT NULL COMMENT '닉네임',                  -- 사용자 닉네임
  last_login DATETIME DEFAULT NULL COMMENT '마지막 로그인 시각',     -- 마지막 로그인 시각
  role ENUM('user','admin') NOT NULL DEFAULT 'user' COMMENT '권한', -- 권한 구분
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,                    -- 가입일시
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- 정보 수정일시
  UNIQUE KEY uk_provider_social (provider, social_id),              -- provider+social_id 조합 유일(소셜회원 중복가입 방지)
  CHECK (provider = 'local' OR social_id IS NOT NULL)               -- local 회원인 경우 social_id NULL 허용
);

-- 지역 목록 테이블
CREATE TABLE regions (
  id INT AUTO_INCREMENT PRIMARY KEY,   -- 지역 고유 ID
  name VARCHAR(100),                   -- 지역명 (예: 서울, 부산)
  code VARCHAR(20)                     -- 지역 코드 (API 연동용)
);

-- 지역별 시계열 데이터 테이블 (전처리 완료된 실제 값)
CREATE TABLE region_data (
  id INT AUTO_INCREMENT PRIMARY KEY,                      -- 고유 ID
  region_id INT,                                          -- 참조: regions.id
  date DATE,                                              -- 기준 월
  production_index FLOAT,                                 -- 제조업 생산지수
  power_usage FLOAT,                                      -- 전력 사용량(MWh)
  export_amount FLOAT,                                    -- 수출액(억원)
  temperature_avg FLOAT,                                  -- 평균기온(선택)
  precipitation FLOAT,                                    -- 강수량(선택)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,          -- 입력일시
  FOREIGN KEY (region_id) REFERENCES regions(id)          -- 지역 참조키
);

-- 예측 결과 테이블
CREATE TABLE forecast_results (
  id INT AUTO_INCREMENT PRIMARY KEY,                      -- 고유 ID
  region_id INT,                                          -- 참조: regions.id
  forecast_date DATE,                                     -- 예측 대상 월
  predicted_index FLOAT,                                  -- 예측된 생산지수 값
  confidence FLOAT,                                       -- 예측 신뢰도(0~1)
  model_version VARCHAR(20),                              -- 예측 모델 버전
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,          -- 예측 생성일시
  FOREIGN KEY (region_id) REFERENCES regions(id)          -- 지역 참조키
);

-- 즐겨찾기 테이블
CREATE TABLE favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,                      -- 고유 ID
  user_id INT,                                            -- 참조: users.id
  region_id INT,                                          -- 참조: regions.id
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,          -- 즐겨찾기 등록일시
  FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE,  -- 사용자 삭제 시 함께 삭제
  FOREIGN KEY (region_id) REFERENCES regions(id)          -- 지역 참조키
);

-- 인사이트 메시지 테이블
CREATE TABLE insight_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,                      -- 고유 ID
  region_id INT,                                          -- 참조: regions.id
  date DATE,                                              -- 기준 시점(월)
  message TEXT,                                           -- 인사이트 메시지(자연어)
  message_type VARCHAR(30),                               -- 메시지 유형(상승/하락/이상 등)
  source VARCHAR(20),                                     -- 메시지 생성 출처
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,          -- 생성일시
  FOREIGN KEY (region_id) REFERENCES regions(id)          -- 지역 참조키
);

-- 이메일 인증 코드 테이블
CREATE TABLE email_verification (
  user_id INT PRIMARY KEY,                                -- 참조: users.id
  code VARCHAR(6) NOT NULL,                               -- 6자리 인증 코드
  expires_at DATETIME NOT NULL,                           -- 인증 코드 만료 일시
  used_at DATETIME DEFAULT NULL COMMENT '인증 코드 사용 시각',       -- 인증 코드 사용 시각
  attempts INT NOT NULL DEFAULT 0 COMMENT '인증 시도 횟수',       -- 인증 시도 횟수
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,          -- 코드 생성 일시
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE    -- 사용자 삭제 시 함께 삭제
);

-- 비밀번호 재설정 토큰 테이블
CREATE TABLE password_reset (
  user_id INT PRIMARY KEY,                                -- 참조: users.id
  token VARCHAR(64) NOT NULL,                             -- 비밀번호 재설정 토큰
  expires_at DATETIME NOT NULL,                           -- 토큰 만료 일시
  used_at DATETIME DEFAULT NULL COMMENT '토큰 사용 시각',               -- 토큰 사용 시각
  attempts INT NOT NULL DEFAULT 0 COMMENT '재설정 시도 횟수',         -- 재설정 시도 횟수
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,          -- 토큰 생성 일시
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE    -- 사용자 삭제 시 함께 삭제
);

-- 인증 코드 만료 인덱스
CREATE INDEX idx_email_verification_expires ON email_verification (expires_at);

-- 인덱스 최적화
CREATE UNIQUE INDEX idx_region_date          ON region_data     (region_id, date);           -- 중복 데이터 방지
CREATE UNIQUE INDEX idx_forecast_region_date ON forecast_results(region_id, forecast_date); -- 예측 값 중복 방지

-- 다운로드 기록 테이블
CREATE TABLE download_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,               -- 고유 ID
  user_id INT NOT NULL,                            -- 참조: users.id (회원만 다운로드 가능)
  file_name VARCHAR(255) NOT NULL,                 -- 저장된 파일명
  file_type ENUM('csv','xlsx') NOT NULL,           -- 파일 타입
  page_type VARCHAR(50) NOT NULL,                  -- 다운로드 발생 위치
  params JSON DEFAULT NULL,                        -- 필터/조건 정보(JSON)
  status ENUM('success','failed') DEFAULT 'success', -- 다운로드 성공 여부
  downloaded_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- 다운로드 일시
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE  -- 사용자 삭제 시 함께 삭제
);