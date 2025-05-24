import os

from flask import request
from gotrue import User  # no idea what gotrue is but it's where supabase gets its users
from supabase import Client, ClientOptions, create_client

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_ANON_KEY")


def get_current_user() -> User:
    supabase = get_logged_in_supabase()
    jwt = get_current_jwt()
    return supabase.auth.get_user(jwt).user


def get_logged_in_supabase() -> Client:
    return create_client(
        url,
        key,
        ClientOptions(
            headers={
                "Authorization": f"Bearer {get_current_jwt()}",
            }
        ),
    )


def get_current_jwt() -> str:
    if not request.headers.get("Authorization"):
        raise Exception("failed: no jwt")

    auth_parts = request.headers.get("Authorization").split(" ")

    if len(auth_parts) != 2:
        raise Exception("failed: malformed token")
    if auth_parts[0].strip() != "Bearer":
        raise Exception("failed: malformed token")

    return auth_parts[1]
