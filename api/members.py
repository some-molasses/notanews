from auth import get_logged_in_supabase
from flask import Blueprint, jsonify, request

members_bp = Blueprint("members", __name__)


@members_bp.route("/api/members/<membership_id>", methods=["PATCH"])
def update_membership(membership_id: str):
    supabase = get_logged_in_supabase()
    body = request.get_json()

    response = (
        supabase.table("paper_members")
        .update({"type": body["role"]})
        .eq("id", membership_id)
        .execute()
    )

    return jsonify(response.data)
