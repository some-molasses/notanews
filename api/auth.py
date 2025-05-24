from datetime import datetime, timezone

from auth_utils import get_current_user
from flask import Blueprint, jsonify, request

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/api/user2", methods=["GET"])
def get_user_api():
    return jsonify(get_current_user())
