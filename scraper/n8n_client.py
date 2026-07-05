import os
import json
import requests
from database import db_service

# Firebase dynamic links often require an external API request if using the REST API 
# since the Admin SDK doesn't natively generate Dynamic Links in Python (only custom tokens/auth).
# For this mock, we will generate a standard URL or use the REST API if FIREBASE_WEB_API_KEY is present.

class N8nClient:
    def __init__(self):
        self.webhook_url = os.environ.get("N8N_WEBHOOK_URL", "http://localhost:5678/webhook/kairos-job-alert")
        self.firebase_web_api_key = os.environ.get("VITE_FIREBASE_API_KEY")

    def generate_dynamic_link(self, job_id, fallback_url):
        import secrets
        code = secrets.token_hex(4)
        db_service.db.shortlinks.insert_one({
            "code": code, "jobId": str(job_id),
            "originalUrl": fallback_url, "isActive": True
        })
        base_url = os.environ.get("APP_BASE_URL", "http://localhost:3000")
        return f"{base_url}/s/{code}"

    def trigger_alert(self, job_dict, channel="WhatsApp", user_id="user_123"):
        """Sends a payload to the n8n webhook for automated distribution."""

        profile = db_service.db.userprofiles.find_one({}) or {}
        contact_map = {
            "WhatsApp": profile.get("phone", ""),
            "Telegram": profile.get("telegramChatId", ""),
            "Email": profile.get("email", "")
        }
        contact = contact_map.get(channel, "")
        if not contact:
            print(f"[n8n Client] No {channel} contact on file for user {user_id}, skipping.")
            return False

        job_id = str(job_dict.get("_id", job_dict.get("id", "unknown")))
        original_url = job_dict.get("url", "https://kairos.inclusive/jobs")
        dynamic_link = self.generate_dynamic_link(job_id, original_url)

        payload = {
            "userId": user_id,
            "channel": channel,
            "contact": contact,
            "job": {
                "title": job_dict.get("title"),
                "company": job_dict.get("company"),
                "accommodations": job_dict.get("accommodations", {}),
                "aiSummary": job_dict.get("aiSummary"),
                "resilientUrl": dynamic_link
            },
            "message": f"New Highly Compatible Job Alert: {job_dict.get('title')} at {job_dict.get('company')}! Review the accessibility features here: {dynamic_link}"
        }

        try:
            res = requests.post(self.webhook_url, json=payload)
            if res.status_code == 200:
                print(f"[n8n Client] Successfully triggered alert for {channel}")
                return True
            else:
                print(f"[n8n Client] Webhook rejected payload: {res.status_code} - {res.text}")
                return False
        except Exception as e:
            print(f"[n8n Client] Webhook POST failed: {e}")
            return False

n8n_client = N8nClient()
