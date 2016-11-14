from flask import json
from . import socketio
from .models import Document


def push_new_document(document):
    """Push new document to all connected Socket.IO clients."""
    socketio.emit('action',
                  {'type': 'ADD_DOCUMENT',
                   'data': document.serialize()})
