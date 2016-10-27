from . import db, bcrypt
import uuid
from tika import parser


class User(db.Model):
    __bind_key__ = 'crate'
    __tablename__ = 'user'
    id = db.Column(db.String,
                   default=lambda: str(uuid.uuid4()),
                   primary_key=True)
    email = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))

    def __init__(self, email, password, id):
        self.id = id
        self.email = email
        self.password = User.hashed_password(password).decode('utf-8')

    @staticmethod
    def hashed_password(password):
        return bcrypt.generate_password_hash(password)

    @staticmethod
    def get_user_with_email_and_password(email, password):
        user = User.query.filter_by(email=email).first()
        if user and bcrypt.check_password_hash(user.password, password):
            return user
        else:
            return None


class Document(db.Model):
    __bind_key__ = 'crate'
    __tablename__ = 'blobsmeta'
    file_id = db.Column(db.String, primary_key=True)
    contents = db.Column(db.String)
    version = db.Column(db.Integer)

    def __init__(self, file_id, contents, version=1):
        self.file_id = file_id
        self.contents = contents
        self.version = version

    def __repr__(self):
        return '<Document %r>' % self.digest

    @staticmethod
    def create(file_id, file_url):
        """Create a new document. The data is obtained from Tika
        """
        file_data = parser.from_file(file_url, "http://localhost:9998")
        doc = Document(file_id=file_id,
                       contents=file_data.get('content', ),
                       version=1)

        return doc

    def serialize(self):
        return {
            'file_id': self.file_id,
            'version': self.version
        }

    @staticmethod
    def get_all_documents_with_doc_id(file_id):
        documents = Document.query.filter_by(file_id=file_id).all()
        if documents:
            return documents
        else:
            return None

    @staticmethod
    def get_document_with_digest(digest):
        document = Document.query.filter_by(digest=digest).first()
        if document:
            return document
        else:
            return None

    @staticmethod
    def get_all_documents():
        documents = Document.query.all()

        if documents:
            serial_docs = [doc.serialize() for doc in documents]
            return serial_docs
        else:
            return None
