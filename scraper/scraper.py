import os
import json
import requests
from bs4 import BeautifulSoup
from groq import Groq
from database import db_service

class KairosScraper:
    def __init__(self):
        # Initialize Groq client for AI extraction
        self.groq_api_key = os.environ.get("GROQ_API_KEY")
        if self.groq_api_key and self.groq_api_key != "REDACTED_FOR_SECURITY":
            self.ai_client = Groq(api_key=self.groq_api_key)
        else:
            self.ai_client = None
            print("[Scraper] Warning: GROQ_API_KEY missing. AI Extraction will fail.")

    def fetch_page_text(self, url):
        """Fetches a webpage and extracts visible text using BeautifulSoup."""
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
        }
        try:
            res = requests.get(url, headers=headers, timeout=10)
            res.raise_for_status()
            soup = BeautifulSoup(res.text, 'html.parser')
            
            # Remove scripts and styles
            for script in soup(["script", "style", "nav", "footer"]):
                script.extract()
                
            text = soup.get_text(separator=' ', strip=True)
            # Truncate to reasonable length for LLM context window (~6k chars)
            return text[:6000]
        except Exception as e:
            print(f"[Scraper] Failed to fetch {url}: {e}")
            return None

    def ai_extract_job(self, text, source_url):
        """Uses Groq (Llama-3) to extract structured data from the raw scraped text."""
        if not self.ai_client:
            return None

        prompt = f"""
        Analyze the following scraped job description text. Extract the job details and perform classification for differently-abled suitability categories (Vision Impaired, Orally Challenged, Audibly Challenged).
        Extract specific accommodation recommendations (Tooling and Policy items) and generate a friendly, plain-language 'aiSummary' explaining why it matches.

        Job Text:
        \"\"\"{text}\"\"\"
        """
        
        system_instruction = """
        You are an AI job classifier. Return ONLY a valid JSON object matching this structure:
        {
          "title": "Job Title",
          "company": "Company Name",
          "location": "Remote or city",
          "salary": "Salary range or 'Competitive'",
          "categories": ["Vision Impaired", "Orally Challenged", "Audibly Challenged"],
          "toolingAccommodations": ["tool1", "tool2"],
          "policyAccommodations": ["policy1", "policy2"],
          "aiSummary": "Summary here"
        }
        Output nothing except the JSON data.
        """

        try:
            completion = self.ai_client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_instruction},
                    {"role": "user", "content": prompt}
                ],
                model="llama3-8b-8192",
                response_format={"type": "json_object"}
            )
            data = json.loads(completion.choices[0].message.content)
            
            # Format to match the Mongoose schema
            job_doc = {
                "title": data.get("title", "Parsed Role"),
                "company": data.get("company", "Unknown Company"),
                "location": data.get("location", "Remote"),
                "description": text[:300] + "...",
                "url": source_url,
                "salary": data.get("salary", "Competitive"),
                "categories": [c for c in data.get("categories", []) if c in ["Vision Impaired", "Orally Challenged", "Audibly Challenged"]],
                "accommodations": {
                    "tooling": data.get("toolingAccommodations", []),
                    "policy": data.get("policyAccommodations", [])
                },
                "aiSummary": data.get("aiSummary", "Parsed successfully."),
                "isActive": True
            }
            return job_doc
            
        except Exception as e:
            print(f"[Scraper] AI Extraction failed: {e}")
            return None

    def run_scrape(self, url):
        """Orchestrates the scrape for a single URL, checking Redis cache first."""
        
        # 1. Check Cache to avoid redundant scraping
        cache_key = f"scraped_url:{url}"
        if db_service.cache_get(cache_key):
            print(f"[Scraper] URL already scraped recently: {url}")
            return None
            
        print(f"[Scraper] Fetching text from {url}...")
        raw_text = self.fetch_page_text(url)
        if not raw_text:
            return None
            
        print("[Scraper] Extracting structured data via AI...")
        job_doc = self.ai_extract_job(raw_text, url)
        
        if job_doc:
            # 2. Save to Redis cache for 24 hours
            db_service.cache_set(cache_key, "1", ex=86400)
            return job_doc
        
        return None

kairos_scraper = KairosScraper()
