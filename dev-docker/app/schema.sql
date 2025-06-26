-- 데이터베이스 설정
CREATE DATABASE IF NOT EXISTS manufacturing_insight;
USE manufacturing_insight;

-- 사용자 테이블: 회원 정보 저장
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT '사용자 고유 ID',
  email VARCHAR(100) NOT NULL UNIQUE COMMENT '사용자 이메일 (고유)',
  password_hash VARCHAR(255) NOT NULL COMMENT '비밀번호 해시값',
  name VARCHAR(50) COMMENT '사용자 이름',
  login_type VARCHAR(10) COMMENT '로그인 방식 (email, google 등)',
  purpose VARCHAR(30) COMMENT '사용 목적 (예: 투자, 리서치 등)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '가입일시'
) COMMENT='회원 가입 및 로그인 정보 저장';

-- 사용자 관심 설정 테이블
CREATE TABLE user_preferences (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT '설정 고유 ID',
  user_id INT NOT NULL COMMENT '사용자 ID (users 참조)',
  region_code VARCHAR(20) NOT NULL COMMENT '관심 지역 코드',
  industry_code VARCHAR(20) NOT NULL COMMENT '관심 업종 코드',
  FOREIGN KEY (user_id) REFERENCES users(id)
) COMMENT='사용자가 설정한 관심 지역/업종 정보';

-- 제조업 생산지수 데이터
CREATE TABLE production_index (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT '고유 ID',
  date DATE NOT NULL COMMENT '기준 날짜 (월별)',
  region_code VARCHAR(20) NOT NULL COMMENT '지역 코드',
  industry_code VARCHAR(20) NOT NULL COMMENT '업종 코드',
  production_index FLOAT NOT NULL COMMENT '생산지수 값',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '최종 업데이트 일시',
  UNIQUE KEY uniq_prod (date, region_code, industry_code)
) COMMENT='KOSIS 기준 제조업 생산지수 (월별/지역/업종 기준)';

-- 산업용 전력 사용량
CREATE TABLE power_usage (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT '고유 ID',
  date DATE NOT NULL COMMENT '기준 날짜 (월별)',
  region_code VARCHAR(20) NOT NULL COMMENT '지역 코드',
  power_usage FLOAT NOT NULL COMMENT '산업용 전력 사용량',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '최종 업데이트 일시',
  UNIQUE KEY uniq_power (date, region_code)
) COMMENT='한국전력 기준 산업용 전력 사용량';

-- 수출 금액 데이터
CREATE TABLE export_data (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT '고유 ID',
  date DATE NOT NULL COMMENT '기준 날짜 (월별)',
  region_code VARCHAR(20) NOT NULL COMMENT '지역 코드',
  export_amount BIGINT NOT NULL COMMENT '수출 금액 (단위: 억원 또는 원)',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '최종 업데이트 일시',
  UNIQUE KEY uniq_export (date, region_code)
) COMMENT='지역별 월별 수출 금액 데이터 (단위는 주석 또는 문서에 명시)';

--  날씨 보조 변수 데이터
CREATE TABLE weather_data (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT '고유 ID',
  date DATE NOT NULL COMMENT '기준 날짜 (월별)',
  region_code VARCHAR(20) NOT NULL COMMENT '지역 코드',
  avg_temp FLOAT COMMENT '월 평균 기온',
  max_temp FLOAT COMMENT '월 최고 기온',
  precipitation FLOAT COMMENT '월 강수량',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '최종 업데이트 일시',
  UNIQUE KEY uniq_weather (date, region_code)
) COMMENT='기온 및 강수량 등 보조 변수로 사용되는 기후 데이터';

-- 예측 결과 저장
CREATE TABLE prediction_results (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT '고유 ID',
  date DATE NOT NULL COMMENT '예측 대상 날짜 (예: 2025-07-01)',
  region_code VARCHAR(20) NOT NULL COMMENT '지역 코드',
  industry_code VARCHAR(20) NOT NULL COMMENT '업종 코드',
  predicted_index FLOAT NOT NULL COMMENT '예측된 생산지수',
  confidence FLOAT COMMENT '예측 신뢰도 (0~1)',
  model_version VARCHAR(20) COMMENT '모델 버전 (예: v1.0)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '예측 생성 일시',
  UNIQUE KEY uniq_prediction (date, region_code, industry_code)
) COMMENT='예측 모델 결과 저장용. 지역/업종별 생산지수 예측값과 신뢰도 저장';

-- 사용자 알림 메시지
CREATE TABLE user_alerts (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT '고유 ID',
  user_id INT NOT NULL COMMENT '사용자 ID (users 참조)',
  message TEXT NOT NULL COMMENT '알림 메시지 내용',
  read_status BOOLEAN DEFAULT FALSE COMMENT '읽음 여부 (false: 미읽음)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '알림 생성 일시',
  FOREIGN KEY (user_id) REFERENCES users(id)
) COMMENT='예측 급변 등 사용자 알림 메시지 저장 (읽음 여부 포함)';
