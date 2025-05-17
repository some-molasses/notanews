from auth import get_current_user, get_logged_in_supabase
from flask import Blueprint, jsonify, request

members_bp = Blueprint("members", __name__)


@members_bp.route("/api/members/my_memberships", methods=["GET"])
def get_my_memberships():
    supabase = get_logged_in_supabase()
    user = get_current_user()

    response = (
        supabase.table("paper_members")
        .select("paper_id")
        .eq("user_id", user.id)
        .execute()
    )

    return jsonify(response.data)


@members_bp.route("/api/members/membership_to/<paper_id>", methods=["GET"])
def get_membership_to(paper_id: str):
    supabase = get_logged_in_supabase()
    user = get_current_user()

    response = (
        supabase.table("paper_members")
        .select("type")
        .eq("user_id", user.id)
        .eq("paper_id", paper_id)
        .execute()
    )

    return jsonify(response.data[0])


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
