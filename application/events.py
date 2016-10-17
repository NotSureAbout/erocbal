from flask import g, session, json

from . import db, socketio, celery
from .models import User, Document


@socketio.on('connect')
def connect_handler():
    documents = Document.get_all_documents()
    if documents:
        # For now we broadcast to everybody.
        socketio.emit('status', {'data': json.dumps(documents)}, broadcast=True)
    else:
        socketio.emit('status', {'data': 'No documents'}, broadcast=True)
