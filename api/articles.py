from datetime import datetime, timezone

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
    response = (
        supabase.table("articles")
        .select("*, issues(name, papers(name, id))")
        .eq("id", id)
        .execute()
    )
    return jsonify(response.data)


def get_all_articles():
    supabase = get_logged_in_supabase()
    user = get_current_user()
    response = (
        supabase.table("articles")
        .select("*, issues(name, papers(name, id))")
        .eq("user_id", user.id)
        .execute()
    )
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
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }
        )
        .execute()
    )

    return jsonify(response.data[0])


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
                "issue_id": article["issue_id"],
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }
        )
        .eq("id", article["id"])
        .execute()
    )

    return jsonify(response.data)


@articles_bp.route("/api/articles/<article_id>/submit", methods=["PATCH"])
def submit_article(article_id: str):
    # @todo add validation that the article is not already approved
    return set_article_state_to(article_id, "submitted")


@articles_bp.route("/api/articles/<article_id>/approve", methods=["PATCH"])
def approve_article(article_id: str):
    # @todo add validation that the article is not already approved
    return set_article_state_to(article_id, "approved")


@articles_bp.route("/api/articles/<article_id>/revert_to_draft", methods=["PATCH"])
def revert_article(article_id: str):
    return set_article_state_to(article_id, "draft")


def set_article_state_to(article_id: str, state: str):
    supabase = get_logged_in_supabase()
    response = (
        supabase.table("articles")
        .update(
            {
                "state": state,
            }
        )
        .eq("id", article_id)
        .execute()
    )

    return jsonify(response.data)


@articles_bp.route("/api/articles/<id>", methods=["DELETE"])
def delete_article(id):
    supabase = get_logged_in_supabase()
    response = supabase.table("articles").delete().eq("id", id).execute()

    return jsonify(response.data)
