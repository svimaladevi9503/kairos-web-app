export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  salary: string;
  postedAt: string;
  logoUrl: string;
  categories: ('Vision Impaired' | 'Orally Challenged' | 'Audibly Challenged')[];
  accommodations: {
    tooling: string[];
    policy: string[];
  };
  aiSummary: string;
  isActive: boolean;
  compatibilityScore?: number; // Calculated score out of 100 based on user profile
  compatibilityReason?: string; // AI generated explanation
  highlightedSkills?: string[]; // Overlapping matching skills
}

export interface UserProfile {
  name: string;
  email: string;
  skills: string[];
  experience: string;
  education: string;
  suitabilityCategories: ('Vision Impaired' | 'Orally Challenged' | 'Audibly Challenged')[];
  accommodationRequirements: string[];
  resume?: {
    name: string;
    size: number;
    type: string;
    uploadedAt: string;
  } | null;
  autoApply?: boolean;
}

export interface FeedbackEntry {
  id: string;
  type: 'job_match' | 'ai_summary' | 'chatbot';
  targetId?: string; // e.g. jobId or summaryId or chatMsgId
  targetLabel?: string; // e.g. "Senior UX Researcher" or "FigmaCraft"
  rating: number; // 1 to 5 rating
  comment: string;
  timestamp: string;
}

export interface Application {
  id: string;
  jobId: string;
  job: Job;
  appliedAt: string;
  status: 'applied' | 'under_review' | 'interviewing' | 'link_decayed';
  decayNotificationChannel: 'WhatsApp' | 'Telegram' | 'Email' | null;
  decayMessage: string | null;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestedJobs?: Job[];
}

