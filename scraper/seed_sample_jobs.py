import random
from database import db_service

random.seed(42)

TITLES = [
    "Software Engineer (Backend)", "Frontend Developer", "Data Analyst", "UX Researcher",
    "Content Writer", "Customer Support Specialist (Chat-Based)", "QA Test Engineer",
    "HR Coordinator", "Graphic Designer", "Financial Analyst", "Marketing Specialist",
    "Technical Writer", "Accountant", "Project Coordinator", "Social Media Manager",
    "Business Analyst", "Technical Recruiter", "Product Manager", "Data Entry Specialist",
    "Translator (Written)", "Legal Assistant", "Research Analyst",
    "IT Support Specialist (Remote)", "Bookkeeper", "Video Editor"
]

COMPANIES = [
    "Nimbus Cloud Systems", "BrightPath Analytics", "Solace Health Tech", "Vertex Data Labs",
    "Lucent Software Co.", "Northwind Digital", "Clearview Media Group", "Aster & Finch Consulting",
    "Meridian Fintech", "Harborlight Studios", "Pinnacle Logistics", "Silverline Robotics",
    "Cobalt Analytics", "Evergreen Learning", "Quantum Retail Co.", "Fernwood Design",
    "BlueCrest Insurance", "Ironwood Manufacturing", "Sundial Media", "Rosewood Legal Partners",
    "Starling Communications", "Cedarbrook Foods", "Novaline Pharma", "Willowmere Consulting",
    "Granite Peak Ventures"
]

LOCATIONS = [
    "Remote", "Chennai, TN", "Bengaluru, KA", "Hyderabad, TS", "Pune, MH",
    "Mumbai, MH", "Remote (India)", "Delhi NCR", "Coimbatore, TN", "Remote (Global)"
]

SALARIES = [
    "₹4,50,000 - ₹6,50,000 PA", "₹6,00,000 - ₹9,00,000 PA", "₹8,00,000 - ₹12,00,000 PA",
    "Competitive", "₹3,50,000 - ₹5,00,000 PA", "₹10,00,000 - ₹15,00,000 PA"
]

POSTED = ["Just now", "5 hours ago", "2 days ago", "3 days ago", "1 week ago"]

ACCOMMODATIONS = {
    "Vision Impaired": {
        "tooling": [
            "NVDA/JAWS screen reader compatibility",
            "High-contrast & scalable UI themes",
            "Braille display support for reports",
            "Accessible PDF & mandatory alt-text documentation",
            "Voice-command navigation tools",
        ],
        "policy": [
            "Remote-first working policy",
            "Flexible screen-time break schedule",
            "Extended deadlines for visually-intensive tasks",
            "Orientation & mobility training stipend",
        ],
    },
    "Orally Challenged": {
        "tooling": [
            "AAC (Augmentative & Alternative Communication) device support",
            "Text-based standup & status tools (Slack/Teams)",
            "Speech-to-text transcription software",
            "Written interview & assessment format",
        ],
        "policy": [
            "No mandatory verbal presentations",
            "Asynchronous, written-first communication culture",
            "Flexible meeting participation via chat",
            "Written performance review process",
        ],
    },
    "Audibly Challenged": {
        "tooling": [
            "Live captioning tools (Otter.ai / Google Live Transcribe)",
            "Visual & vibrating alert systems",
            "Sign language interpreter on request",
            "TTY/relay service compatibility",
        ],
        "policy": [
            "Sign language interpreter budget for meetings",
            "Caption-mandatory video/meeting policy",
            "Visual (non-audio) emergency alert systems onsite",
            "Asynchronous communication culture",
        ],
    },
}

ALL_CATEGORIES = list(ACCOMMODATIONS.keys())


def build_job(i):
    title = TITLES[i % len(TITLES)]
    company = COMPANIES[(i * 7) % len(COMPANIES)]  # offset avoids repeating pairs
    location = random.choice(LOCATIONS)
    salary = random.choice(SALARIES)
    posted = random.choice(POSTED)

    if i % 5 == 0:
        cats = random.sample(ALL_CATEGORIES, 2)  # some multi-category roles
    else:
        cats = [ALL_CATEGORIES[i % 3]]

    tooling, policy = [], []
    for c in cats:
        tooling += random.sample(ACCOMMODATIONS[c]["tooling"], 2)
        policy += random.sample(ACCOMMODATIONS[c]["policy"], 2)
    tooling, policy = list(dict.fromkeys(tooling)), list(dict.fromkeys(policy))

    cat_text = " and ".join(cats)
    description = (
        f"{company} is hiring a {title} to join their growing team in {location}. "
        f"This role has been reviewed and classified by Kairos's AI accommodation engine "
        f"as suitable for {cat_text} candidates, with dedicated tooling and policy support in place."
    )
    ai_summary = (
        f"This role at {company} is a strong match for {cat_text} job seekers — the employer "
        f"provides {tooling[0].lower()} and follows a policy of {policy[0].lower()}, "
        f"making day-to-day work genuinely accessible rather than just formally compliant."
    )

    return {
        "title": title,
        "company": company,
        "location": location,
        "description": description,
        "url": f"https://kairos.inclusive/jobs/sample-{i + 1}",
        "salary": salary,
        "postedAt": posted,
        "logoUrl": "",
        "categories": cats,
        "accommodations": {"tooling": tooling, "policy": policy},
        "aiSummary": ai_summary,
        "isActive": True,
    }


def main():
    collection = db_service.get_jobs_collection()
    if collection is None:
        print("[Seed] MongoDB not connected. Aborting.")
        return

    jobs = [build_job(i) for i in range(50)]
    result = collection.insert_many(jobs)
    print(f"[Seed] Inserted {len(result.inserted_ids)} sample jobs into MongoDB.")


if __name__ == "__main__":
    main()
