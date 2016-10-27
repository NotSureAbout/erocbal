from flask import json
from . import socketio
from .models import Document


def push_document_update(document):
    """Push document update to all connected Socket.IO clients."""
    socketio.emit('updated_document', {'data': document.serialize()})


def push_new_document(document):
    """Push new document to all connected Socket.IO clients."""
    socketio.emit('new_document', {'data': document.serialize()})


@socketio.on('connect')
def connect_handler():
    """
    Handle connection from clients

    Return all the documents to the grid.
    """
    documents = Document.get_all_documents()
    if documents:
        # For now we broadcast to everybody.
        socketio.emit('status',
                      {'data': json.dumps(documents)},
                      broadcast=True)
    else:
        socketio.emit('status',
                      {'data': 'No documents'},
                      broadcast=True)
