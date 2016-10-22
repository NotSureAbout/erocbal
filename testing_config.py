from flask_testing import TestCase
from application import create_app as _create_app
from application.models import User
from application import db
import os
from setup import basedir
import json


class BaseTestConfig(TestCase):
    default_user = {
        "email": "default@gmail.com",
        "password": "something2"
    }

    def create_app(self):
        self.app = _create_app('testing')
        return self.app

    def setUp(self):

        db.create_all()
        self.ctx = self.app.app_context()
        self.ctx.push()
        db.drop_all()  # just in case
        db.create_all()
        self.client = self.app.test_client()

        res = self.client.post(
                "/api/create_user",
                data=json.dumps(self.default_user),
                content_type='application/json'
        )

        self.token = json.loads(res.data.decode("utf-8"))["token"]

    def tearDown(self):
        db.session.remove()
        db.drop_all()
