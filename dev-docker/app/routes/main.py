# main.py - Flask 앱의 기본 라우트와 Blueprint를 정의
from flask import Blueprint # type: ignore

# Blueprint는 Flask에서 라우트들을 그룹화하여 모듈화할 수 있게 해줌
bp = Blueprint('main', __name__)

# 기본 경로('/')로 요청이 들어오면 'Hello from Flask!' 메시지를 반환
@bp.route('/')
def index():
    return 'Flask 정상 실행 됬어요 성공했네요 축하해요!'

# 서버 헬스체크용 ping 엔드포인트
@bp.route('/ping', methods=['GET'])
def ping():
    return {'message': 'pong!'}

# db 상태체크 라우트 블루프린트 등록
# ping_db.py에서 bp라는 이름으로 Blueprint 객체를 가져와 서브 블루프린트로 등록
from .ping import bp as ping_Check
bp.register_blueprint(ping_Check)