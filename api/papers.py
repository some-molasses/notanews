from flask import Blueprint, jsonify, request

from .auth_utils import get_current_user, get_logged_in_supabase

papers_bp = Blueprint("papers", __name__)


# returns current user's papers
@papers_bp.route("/api/papers", methods=["GET"])
def get_papers():
    supabase = get_logged_in_supabase()
    user = get_current_user()

    query = (
        supabase.table("papers")
        .select("*, paper_members!inner()")
        .eq("paper_members.user_id", user.id)
    )

    if request.args.get("subset") == "editable":
        query = query.eq("paper_members.type", "editor")

    response = query.execute()
    return jsonify(response.data)


# returns all papers
@papers_bp.route("/api/papers/discover", methods=["GET"])
def get_discoverable_papers():
    supabase = get_logged_in_supabase()
    response = supabase.table("papers").select("*").execute()
    return jsonify(response.data)


@papers_bp.route("/api/papers/<id>", methods=["GET"])
def get_paper_by_id(id: str):
    supabase = get_logged_in_supabase()
    response = supabase.table("papers").select("*").eq("id", id).execute()
    return jsonify(response.data[0])


@papers_bp.route("/api/papers/<paper_id>/members", methods=["GET"])
def get_paper_members(paper_id: str):
    supabase = get_logged_in_supabase()
    response = (
        supabase.table("paper_members_detailed")
        .select("*")
        .eq("paper_id", paper_id)
        .execute()
    )
    return jsonify(response.data)


@papers_bp.route("/api/papers/<paper_id>/issues", methods=["GET"])
def get_paper_issues(paper_id: str):
    supabase = get_logged_in_supabase()
    response = supabase.table("issues").select("*").eq("paper_id", paper_id).execute()
    return jsonify(response.data)
