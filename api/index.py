from articles import articles
from flask import Flask, jsonify, request
from gotrue import User  # no idea what gotrue is but it's where supabase gets its users
from supabase import Client, ClientOptions, create_client

app = Flask(__name__)

app.register_blueprint(articles)
