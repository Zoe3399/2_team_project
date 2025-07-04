import os
from urllib.parse import quote_plus


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'default-secret-key')

    DB_USER = os.environ.get('DB_USER', 'user')
    DB_PASSWORD = quote_plus(os.environ.get('DB_PASSWORD', 'uS3r_p@ss_2024'))
    DB_HOST = os.environ.get('DB_HOST', 'db')
    DB_PORT = os.environ.get('DB_PORT', 3306)
    DB_NAME = os.environ.get('DB_NAME', 'prod_predict')

    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

print("DB URI:", Config.SQLALCHEMY_DATABASE_URI)