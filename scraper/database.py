import os
import sys
from dotenv import load_dotenv
# pyrefly: ignore [missing-import]
from pymongo import MongoClient
import redis
# pyrefly: ignore [missing-import]
import firebase_admin
from firebase_admin import credentials, firestore, storage

# Load the .env.local file from the parent directory
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
env_path = os.path.join(parent_dir, '.env.local')
load_dotenv(dotenv_path=env_path)

class DatabaseService:
    def __init__(self):
        # 1. MongoDB Setup
        mongo_uri = os.environ.get("MONGO_URI")
        if not mongo_uri or mongo_uri == "YOUR_MONGO_URI_HERE":
            print("[MongoDB] Warning: MONGO_URI is not set. Scraper will fail to save.")
            self.mongo_client = None
            self.db = None
        else:
            self.mongo_client = MongoClient(mongo_uri)
            # Default database name is 'kairos' or extracted from URI
            self.db = self.mongo_client.get_database("kairos")
            print("[MongoDB] Connected to Atlas successfully.")

        # 2. Redis Setup
        redis_url = os.environ.get("REDIS_URL")
        if not redis_url or redis_url == "YOUR_REDIS_URL_HERE":
            print("[Redis] Warning: REDIS_URL is not set.")
            self.redis_client = None
        else:
            self.redis_client = redis.from_url(redis_url)
            print("[Redis] Connected to Cache successfully.")

        # 3. Firebase Admin Setup
        service_account_path = os.path.join(os.path.dirname(__file__), "serviceAccountKey.json")
        self.firebase_app = None
        if os.path.exists(service_account_path):
            try:
                cred = credentials.Certificate(service_account_path)
                # Check if already initialized to prevent errors in hot-reloading
                if not firebase_admin._apps:
                    self.firebase_app = firebase_admin.initialize_app(cred)
                else:
                    self.firebase_app = firebase_admin.get_app()
                print("[Firebase] Admin SDK initialized successfully.")
            except Exception as e:
                print(f"[Firebase] Initialization failed: {e}")
        else:
            print("[Firebase] Warning: serviceAccountKey.json not found. n8n Dynamic Links will fail.")

    def get_jobs_collection(self):
        return self.db.jobs if self.db is not None else None

    def cache_set(self, key, value, ex=3600):
        if self.redis_client:
            self.redis_client.set(key, value, ex=ex)

    def cache_get(self, key):
        if self.redis_client:
            return self.redis_client.get(key)
        return None

# Singleton instance
db_service = DatabaseService()
