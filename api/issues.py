from auth import get_logged_in_supabase
from flask import Blueprint, jsonify, request

issues_bp = Blueprint("issues", __name__)


@issues_bp.route("/api/issues", methods=["GET"])
def get_issues():
    supabase = get_logged_in_supabase()

    if request.args.get("state"):
        response = (
            supabase.table("issues")
            .select("*, papers(name)")
            .eq("state", request.args.get("state"))
            .execute()
        )
    else:
        response = supabase.table("issues").select("*, papers(name, id)").execute()

    return jsonify(response.data)


@issues_bp.route("/api/issues/<id>", methods=["GET"])
def get_issue_by_id(id: str):
    supabase = get_logged_in_supabase()
    response = (
        supabase.table("issues").select("*, papers(name, id)").eq("id", id).execute()
    )
    return jsonify(response.data[0])


@issues_bp.route("/api/issues/<issue_id>/articles", methods=["GET"])
def get_issue_articles(issue_id: str):
    supabase = get_logged_in_supabase()
    response = (
        supabase.table("articles")
        .select("*, issues(issue_number, volume_number, papers(name, id))")
        .eq("issue_id", issue_id)
        .execute()
    )
    return jsonify(response.data)
