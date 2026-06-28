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
        """Generates a Firebase Dynamic Link via REST API so it can survive link decay."""
        if not self.firebase_web_api_key:
            return fallback_url
            
        endpoint = f"https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key={self.firebase_web_api_key}"
        payload = {
            "dynamicLinkInfo": {
                "domainUriPrefix": "https://kairos.page.link",
                "link": f"https://kairos.inclusive/jobs?id={job_id}",
                "androidInfo": {
                    "androidPackageName": "com.kairos.app"
                },
                "iosInfo": {
                    "iosBundleId": "com.kairos.app"
                }
            },
            "suffix": {
                "option": "SHORT"
            }
        }
        
        try:
            res = requests.post(endpoint, json=payload)
            if res.status_code == 200:
                return res.json().get("shortLink", fallback_url)
            else:
                print(f"[n8n Client] Failed to generate dynamic link: {res.text}")
                return fallback_url
        except Exception as e:
            print(f"[n8n Client] Dynamic link error: {e}")
            return fallback_url

    def trigger_alert(self, job_dict, channel="WhatsApp", user_id="user_123"):
        """Sends a payload to the n8n webhook for automated distribution."""
        
        # 1. Generate the resilient dynamic link
        job_id = str(job_dict.get("_id", job_dict.get("id", "unknown")))
        original_url = job_dict.get("url", "https://kairos.inclusive/jobs")
        dynamic_link = self.generate_dynamic_link(job_id, original_url)
        
        # 2. Build the payload matching the expected n8n schema
        payload = {
            "userId": user_id,
            "channel": channel,  # e.g. "WhatsApp", "Telegram", "Email"
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
