from auth import get_current_user, get_logged_in_supabase
from flask import Blueprint, jsonify

papers_bp = Blueprint("papers", __name__)


# @todo only return current user's joined organizations
@papers_bp.route("/api/papers", methods=["GET"])
def get_papers():
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
