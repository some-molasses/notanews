import os
from datetime import datetime
from pprint import pprint

from flask import Flask, jsonify, request
from gotrue import User  # no idea what gotrue is but it's where supabase gets its users
from supabase import Client, create_client

app = Flask(__name__)


url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)


def get_current_user() -> User:
    if not request.headers.get("Authorization"):
        raise Exception("failed: no jwt")

    auth_parts = request.headers.get("Authorization").split(" ")

    if len(auth_parts) != 2:
        raise Exception("failed: malformed token")
    if auth_parts[0].strip() != "Bearer":
        raise Exception("failed: malformed token")

    jwt = auth_parts[1]
    return supabase.auth.get_user(jwt).user


@app.route("/api/articles", methods=["GET"])
def get_article():
    if request.args.get("id"):
        return get_single_article(request.args.get("id"))
    else:
        return get_all_articles()


def get_single_article(id: str):
    response = supabase.table("articles").select("*").eq("id", id).execute()
    return jsonify(response.data)


def get_all_articles():
    user = get_current_user()
    response = supabase.table("articles").select("*").eq("user_id", user.id).execute()
    return jsonify(response.data)


@app.route("/api/articles", methods=["POST"])
def create_article():
    user = get_current_user()
    print(user.id)
    response = (
        supabase.table("articles")
        .insert(
            {
                "user_id": user.id,
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat(),
            }
        )
        .execute()
    )

    return jsonify(response.data)


@app.route("/api/articles", methods=["PATCH"])
def update_article():
    user = get_current_user()
    article = request.get_json()

    response = (
        supabase.table("articles")
        .update(
            {
                "title": article["title"],
                "body": article["body"],
                "pseudonym": article["pseudonym"],
                "updated_at": datetime.now().isoformat(),
            }
        )
        .eq("id", article["id"])
        .execute()
    )

    return jsonify(response.data)
