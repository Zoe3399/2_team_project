#!/usr/bin/env bash

# 사용법: ./wait-for-mysql.sh <host> <port> [timeout_seconds] -- <your_command>
host="$1"
port="$2"
third="$3"

# 필수 인자 확인
if [ -z "$host" ] || [ -z "$port" ]; then
  echo "Usage: $0 <host> <port> [timeout_seconds] -- <your_command>"
  exit 1
fi

# 타임아웃 설정 (초 단위, 기본 60초)
if [[ "$third" =~ ^[0-9]+$ ]]; then
  timeout="$third"
  shift 3
else
  timeout=60
  shift 2
fi

# '--' 구분자 제거
if [ "$1" = "--" ]; then
  shift
fi

# netcat(nc) 설치 여부 확인
command -v nc > /dev/null 2>&1 || {
  echo "Error: nc (netcat) command not found. Please install netcat."
  exit 1
}

start_time=$(date +%s)

# MySQL 서버가 열릴 때까지 대기 (타임아웃 적용)
while true; do
  if nc -z -q1 "$host" "$port"; then
    echo "MySQL is up! Running command..."
    break
  fi
  current_time=$(date +%s)
  elapsed=$((current_time - start_time))
  if [ "$elapsed" -ge "$timeout" ]; then
    echo "Error: Timeout after ${timeout}s waiting for MySQL at ${host}:${port}."
    exit 1
  fi
  echo "Waiting for MySQL at ${host}:${port}... (${elapsed}s elapsed)"
  sleep 2
done

# 지정된 커맨드 실행
exec "$@"