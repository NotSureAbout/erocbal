from flask import request, jsonify, Response
from .. import db
from .. import blob_container
from ..events import push_new_document
from ..models import Document
from ..tasks import async
from . import api

from tempfile import TemporaryFile
import hashlib


@api.route("/upload_file", methods=["POST"])
@async
def upload_file():

    f = TemporaryFile()
    sha = hashlib.sha1()

    try:
        sha.update(request.data)
        file_id = sha.hexdigest()
    except Exception as e:
        raise e

    # Check if the file has already been uploaded
    try:
        if blob_container.exists(file_id):
            # File was already uploaded
            return jsonify(
                message="A file with that digest already exists."), 409
        else:
            f.write(request.data)
            f.seek(0)
            blob_container.put(f, digest=file_id)

    except Exception as e:
        raise e

    # Blob uploaded! Time to create a document
    file_url = build_url(file_id)
    doc = Document.create(file_id, file_url)
    db.session.merge(doc)
    db.session.commit()

    # Notify users connected via socketio
    push_new_document(doc)

    return jsonify(message="Document created."), 201


@api.route('/files/<id>', methods=['GET'])
def get_file(id):
    """
    Return a file.
    @requires_auth should be used. For now there is no protection
    Everybody can read
    """
    if blob_container.exists(id):
        def generate():
            for chunk in blob_container.get(id):
                yield chunk

    return Response(generate(), mimetype='application/pdf')


def build_url(file_id):
    """Contruct url from configuration and file_id."""
    return 'http://localhost:4200' + '/_blobs/myblobs/' + file_id
