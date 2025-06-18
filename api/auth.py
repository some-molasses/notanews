from flask import Blueprint, jsonify

from .auth_utils import get_current_user

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/api/profile", methods=["GET"])
def get_user_api():
    user = get_current_user()

    if not user:
        return None

    # extend this with all needed fields from the user
    return jsonify({"id": user.id, "email": user.email})
