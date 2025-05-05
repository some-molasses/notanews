import os
from datetime import datetime
from typing import TypedDict

from flask import Flask, jsonify
from supabase import Client, create_client

app = Flask(__name__)


class GetArticleResponse(TypedDict):
    author: str
    title: str
    date: str


url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)


@app.route("/api/python")
def get_article() -> GetArticleResponse:
    response = supabase.table("articles").select("*").execute()
    articles = [
        {
            "author": article.get("author", "anonymous"),
            "title": article.get("title", "Untitled"),
            "date": article.get("date", datetime.now().isoformat()),
        }
        for article in response.data
    ]

    return jsonify(response.data)
