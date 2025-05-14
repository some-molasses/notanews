from auth import get_logged_in_supabase
from flask import Blueprint, jsonify

issues_bp = Blueprint("issues", __name__)


@issues_bp.route("/api/issues/<id>", methods=["GET"])
def get_issue_by_id(id: str):
    supabase = get_logged_in_supabase()
    response = supabase.table("issues").select("*").eq("id", id).execute()
    return jsonify(response.data[0])


@issues_bp.route("/api/issues/<issue_id>/articles", methods=["GET"])
def get_paper_issues(issue_id: str):
    supabase = get_logged_in_supabase()
    response = supabase.table("articles").select("*").eq("issue_id", issue_id).execute()
    return jsonify(response.data)
