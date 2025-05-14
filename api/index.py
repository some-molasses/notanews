from articles import articles_bp
from flask import Flask
from issues import issues_bp
from papers import papers_bp

app = Flask(__name__)

app.register_blueprint(articles_bp)
app.register_blueprint(issues_bp)
app.register_blueprint(papers_bp)
