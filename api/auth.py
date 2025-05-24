from auth_utils import get_current_user
from flask import Blueprint, jsonify

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/api/profile", methods=["GET"])
def get_user_api():
    user = get_current_user()

    # extend this with all needed fields from the user
    return jsonify({"email": user.email})
