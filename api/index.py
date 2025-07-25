from flask import Flask

from .articles import articles_bp
from .auth import auth_bp
from .issues import issues_bp
from .members import members_bp
from .papers import papers_bp

app = Flask(__name__)

app.register_blueprint(auth_bp)
app.register_blueprint(articles_bp)
app.register_blueprint(issues_bp)
app.register_blueprint(papers_bp)
app.register_blueprint(members_bp)
