from flask import Blueprint, jsonify, request

from .auth_utils import get_current_user, get_logged_in_supabase

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


@members_bp.route("/api/members/is_editor", methods=["GET"])
def get_my_editorship():
    supabase = get_logged_in_supabase()
    user = get_current_user()

    response = (
        supabase.table("paper_members")
        .select("paper_id", count="exact")
        .eq("user_id", user.id)
        .eq("type", "editor")
        .execute()
    )

    return jsonify({"is_editor": response.count > 0})


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

    if len(response.data):
        return jsonify(response.data[0])

    return jsonify(None)


def get_membership_by_id(membership_id: str):
    supabase = get_logged_in_supabase()

    response = (
        supabase.table("paper_members").select("*").eq("id", membership_id).execute()
    )

    return response.data[0]


def get_editors_of(paper_id: str):
    supabase = get_logged_in_supabase()

    response = (
        supabase.table("paper_members")
        .select("paper_id")
        .eq("type", "editor")
        .eq("paper_id", paper_id)
        .execute()
    )

    return response.data


@members_bp.route("/api/members/<membership_id>", methods=["PATCH"])
def update_membership(membership_id: str):
    supabase = get_logged_in_supabase()
    body = request.get_json()
    new_role = body["role"]

    # if user is the last editor, don't let them leave
    if new_role == "contributor":
        membership = get_membership_by_id(membership_id)
        if len(get_editors_of(membership["paper_id"])) <= 1:
            raise Exception("Failed: not enough remaining editors")

    response = (
        supabase.table("paper_members")
        .update({"type": new_role})
        .eq("id", membership_id)
        .execute()
    )

    return jsonify(response.data)
