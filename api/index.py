from flask import Flask
from datetime import datetime
from typing import TypedDict

app = Flask(__name__)


class GetArticleResponse(TypedDict):
    author: str
    title: str
    date: str


@app.route("/api/python")
def get_article() -> GetArticleResponse:
    return {
        "author": "molasses",
        "title": "n recipes",
        "date": datetime.now().isoformat(),
    }
