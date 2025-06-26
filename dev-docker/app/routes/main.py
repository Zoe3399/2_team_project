# main.py - Flask 앱의 기본 라우트와 Blueprint를 정의
from flask import Blueprint # type: ignore

# Blueprint는 Flask에서 라우트들을 그룹화하여 모듈화할 수 있게 해줌
bp = Blueprint('main', __name__)

# 기본 경로('/')로 요청이 들어오면 'Hello from Flask!' 메시지를 반환
@bp.route('/')
def index():
    return 'Hello from Flask!'

# 서버 상태 확인용 라우트. 서버가 정상 작동 중인지 확인할 수 있음
@bp.route('/ping', methods=['GET'])
def ping():
    return {'message': 'pong!'}