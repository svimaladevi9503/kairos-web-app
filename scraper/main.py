import time
from database import db_service
from scraper import kairos_scraper
from n8n_client import n8n_client

def scrape_and_process(urls):
    print("========================================")
    print("🚀 Starting Kairos Python Scraping Pipeline")
    print("========================================")
    
    collection = db_service.get_jobs_collection()
    
    for url in urls:
        print(f"\nProcessing: {url}")
        job_doc = kairos_scraper.run_scrape(url)
        
        if job_doc:
            if collection is not None:
                try:
                    # 1. Insert into MongoDB
                    result = collection.insert_one(job_doc)
                    job_doc["_id"] = result.inserted_id
                    print(f"[MongoDB] Job successfully inserted with ID: {result.inserted_id}")
                    
                    # 2. Trigger n8n Automation
                    # We will mock a user ID and channel preference. 
                    # In a real scenario, this would query UserProfile collection for matches first.
                    print("[Pipeline] Triggering n8n distribution webhook...")
                    n8n_client.trigger_alert(job_doc, channel="WhatsApp", user_id="user_123")
                    
                except Exception as e:
                    print(f"[Pipeline] Database Error: {e}")
            else:
                print("[Pipeline] MongoDB not connected. Skipping insertion and n8n webhook.")
                print(f"[Dry Run Output]: {job_doc}")
                
        # Politeness delay
        time.sleep(2)

    print("\n========================================")
    print("✅ Pipeline Execution Finished")
    print("========================================")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Kairos Job Scraper Pipeline")
    parser.add_argument("--test-run", action="store_true", help="Run a test scrape with a dummy URL")
    args = parser.parse_args()
    
    if args.test_run:
        target_urls = [
            "https://careers.google.com/jobs/results/141380961819796166-accessibility-software-engineer-frontend-core/"
        ]
    else:
        # In a real CRON scenario, you would pull these from a queue, RSS, or specific company career pages
        target_urls = [
            "https://careers.microsoft.com/v2/global/en/accessibility",
            "https://jobs.apple.com/en-us/details/200547055/accessibility-engineer"
        ]
        
    scrape_and_process(target_urls)
