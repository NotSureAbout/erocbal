from flask import Blueprint, render_template

main = Blueprint('main', __name__)


@main.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@main.route('/<path:path>', methods=['GET'])
def any_root_path(path):
    return render_template('index.html')
