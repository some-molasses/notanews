from datetime import datetime, timezone

from flask import Blueprint, jsonify, request

from api.auth_utils import get_logged_in_supabase

issues_bp = Blueprint("issues", __name__)


@issues_bp.route("/api/issues", methods=["GET"])
def get_issues():
    supabase = get_logged_in_supabase()

    query = supabase.table("issues").select("*, papers(name, id)")

    if request.args.get("state"):
        query = query.in_("state", request.args.get("state").split(","))

    response = query.execute()

    return jsonify(response.data)


@issues_bp.route("/api/issues/<id>", methods=["GET"])
def get_issue_by_id(id: str):
    supabase = get_logged_in_supabase()
    response = (
        supabase.table("issues").select("*, papers(name, id)").eq("id", id).execute()
    )
    return jsonify(response.data[0])


@issues_bp.route("/api/issues/<issue_id>/submitted-articles", methods=["GET"])
def get_issue_articles(issue_id: str):
    supabase = get_logged_in_supabase()
    response = (
        supabase.table("articles")
        .select("*, issues(name, papers(name, id))")
        .in_("state", ["submitted", "approved", "rejected"])
        .eq("issue_id", issue_id)
        .execute()
    )
    return jsonify(response.data)


@issues_bp.route("/api/issues/create", methods=["POST"])
def create_issue():
    supabase = get_logged_in_supabase()
    body = request.get_json()
    response = (
        supabase.table("issues")
        .insert(
            {
                "name": body["issue_name"],
                "paper_id": body["paper_id"],
                "submission_deadline": body["deadline"],
                "state": "writing",
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
        )
        .execute()
    )

    return jsonify(response.data)


@issues_bp.route("/api/issues/close_overdue", methods=["POST"])
def close_overdue_issues():
    supabase = get_logged_in_supabase()
    response = supabase.rpc("close_overdue_issues").execute()

    return jsonify(response.data)
