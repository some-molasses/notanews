import os
from datetime import datetime
from pprint import pprint
from typing import TypedDict

from flask import Flask, jsonify, request
from gotrue import User  # no idea what gotrue is but it's where supabase gets its users
from supabase import Client, create_client

app = Flask(__name__)


class GetArticleResponse(TypedDict):
    author: str
    title: str
    date: str


url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)


def get_current_user() -> User:
    if not request.headers.get("Authorization"):
        raise "failed"

    auth_parts = request.headers.get("Authorization").split(" ")

    if len(auth_parts) != 2:
        raise "failed"
    if auth_parts[0].strip() != "Bearer":
        raise "failed"

    jwt = auth_parts[1]
    return supabase.auth.get_user(jwt).user


@app.route("/api/python")
def get_article() -> GetArticleResponse:
    user = get_current_user()
    response = supabase.table("articles").select("*").eq("user", user.id).execute()

    return jsonify(response.data)
