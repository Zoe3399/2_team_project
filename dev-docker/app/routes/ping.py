# 이 파일은 Flask 애플리케이션의 데이터베이스 연결 상태를 확인하는 엔드포인트를 정의
# db 연결이 됬다고 하면
# /db/ping 경로로 GET 요청을 보내면 'db': 'pong!' 응답을 반환합니다.
# http://localhost:5001/db/ping
# -> DB 연결 확인용, 'db': 'pong!' 응답 → DB 연결도 OK
#localhost:5001/ping
# -> 서버 상태 확인용, 'message': 'pong!' 응답 → 서버 OK
# ping.py
from flask import Blueprint

bp = Blueprint('ping', __name__, url_prefix='/db')

@bp.route('/ping', methods=['GET'])
def ping_Check():
    # DB 연결 성공 여부 반환
    return {'db': 'pong!'}