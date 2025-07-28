from flask import Flask

from api.articles import articles_bp
from api.auth import auth_bp
from api.issues import issues_bp
from api.members import members_bp
from api.papers import papers_bp

app = Flask(__name__)

app.register_blueprint(auth_bp)
app.register_blueprint(articles_bp)
app.register_blueprint(issues_bp)
app.register_blueprint(papers_bp)
app.register_blueprint(members_bp)
