from index import db, bcrypt
import uuid


class User(db.Model):
    __bind_key__ = 'crate'
    __tablename__ = 'user'
    id = db.Column(db.String, primary_key=True)
    email = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))

    def __init__(self, email, password, id):
        self.id = id
        self.email = email
        self.password = User.hashed_password(password)

    @staticmethod
    def hashed_password(password):
        return bcrypt.generate_password_hash(password).decode('utf-8')

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
    doc_id = db.Column(db.String, primary_key=True)
    digest = db.Column(db.String, primary_key=True)
    version = db.Column(db.Integer)

    def __init__(self, doc_id, digest, version):
        self.doc_id = doc_id
        self.digest = digest
        self.version = version

    def __repr__(self):
        return '<Document %r>' % self.digest

    def serialize(self):
        return {
            'doc_id': self.doc_id,
            'digest': self.digest,
            'version': self.version,
        }

    @staticmethod
    def get_all_documents_with_doc_id(doc_id):
        documents = Document.query.filter_by(doc_id=doc_id).all()
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
