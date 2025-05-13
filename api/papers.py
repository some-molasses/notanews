from auth import get_current_user, get_logged_in_supabase
from flask import Blueprint, jsonify

papers_bp = Blueprint("papers", __name__)


# @todo only return current user's joined organizatoins
@papers_bp.route("/api/papers", methods=["GET"])
def get_papers():
    supabase = get_logged_in_supabase()
    response = supabase.table("papers").select("*").execute()
    return jsonify(response.data)
