from datetime import datetime

from auth import get_current_user, get_logged_in_supabase
from flask import Blueprint, jsonify, request

articles_bp = Blueprint("articles", __name__)


@articles_bp.route("/api/articles", methods=["GET"])
def get_article():
    if request.args.get("id"):
        return get_single_article(request.args.get("id"))
    else:
        return get_all_articles()


def get_single_article(id: str):
    supabase = get_logged_in_supabase()
    response = supabase.table("articles").select("*").eq("id", id).execute()
    return jsonify(response.data)


def get_all_articles():
    supabase = get_logged_in_supabase()
    user = get_current_user()
    response = supabase.table("articles").select("*").eq("user_id", user.id).execute()
    return jsonify(response.data)


@articles_bp.route("/api/articles", methods=["POST"])
def create_article():
    supabase = get_logged_in_supabase()
    user = get_current_user()
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


@articles_bp.route("/api/articles", methods=["PATCH"])
def update_article():
    supabase = get_logged_in_supabase()
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


@articles_bp.route("/api/articles/<id>", methods=["DELETE"])
def delete_article(id):
    supabase = get_logged_in_supabase()
    response = supabase.table("articles").delete().eq("id", id).execute()

    return jsonify(response.data)
