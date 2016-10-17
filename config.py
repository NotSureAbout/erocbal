import os

from setup import basedir

basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    SECRET_KEY = "SO_SECURE"
    DEBUG = False
    # SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_BINDS = {'crate': 'crate://'}
    CELERY_CONFIG = {}
    SOCKETIO_MESSAGE_QUEUE = os.environ.get('CELERY_BROKER_URL', 'redis://')


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    pass


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_BINDS = {'crate': 'crate://'}
    CELERY_CONFIG = {'CELERY_ALWAYS_EAGER': True}
    SOCKETIO_MESSAGE_QUEUE = None


config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig
}
