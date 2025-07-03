#!/bin/bash

# 사용법: ./wait-for-mysql.sh <host> <port> -- <your_command>
host="$1"
port="$2"
shift 2

# MySQL 서버가 열릴 때까지 대기
until nc -z "$host" "$port"; do
  echo "⏳ Waiting for MySQL at $host:$port..."
  sleep 2
done

echo "✅ MySQL is up! Running command..."
exec "$@"