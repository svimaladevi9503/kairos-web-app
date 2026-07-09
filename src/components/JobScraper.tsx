import { useReducer, useEffect } from "react";
import { Job } from "../types";
import { JobScraperHeader } from "./JobScraperHeader";
import { JobScraperInput } from "./JobScraperInput";
import { JobScraperResult } from "./JobScraperResult";

interface JobScraperProps {
  onJobAdded: (job: Job) => void;
  highContrast: boolean;
}

const statusPhases = [
  "Scraping job listing description text...",
  "Sending payloads securely to Gemini 3.5 Flash...",
  "Determining disability suitability categories (Vision, Oral, Audibly)...",
  "Extracting specific tooling and policy accommodations...",
  "Formulating friendly, plain-language job summary...",
];

type ScraperState = {
  inputText: string;
  urlText: string;
  loading: boolean;
  statusMessage: string;
  successJob: Job | null;
  errorMsg: string;
};

type ScraperAction =
  | { type: "SET_INPUT"; payload: string }
  | { type: "SET_URL"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_STATUS"; payload: string }
  | { type: "SET_SUCCESS"; payload: Job | null }
  | { type: "SET_ERROR"; payload: string }
  | { type: "RESET" };

function scraperReducer(state: ScraperState, action: ScraperAction): ScraperState {
  switch (action.type) {
    case "SET_INPUT":
      return { ...state, inputText: action.payload, errorMsg: "" };
    case "SET_URL":
      return { ...state, urlText: action.payload, errorMsg: "" };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_STATUS":
      return { ...state, statusMessage: action.payload };
    case "SET_SUCCESS":
      return { ...state, successJob: action.payload };
    case "SET_ERROR":
      return { ...state, errorMsg: action.payload };
    case "RESET":
      return { ...state, successJob: null, errorMsg: "" };
    default:
      return state;
  }
}

export default function JobScraper({ onJobAdded, highContrast }: JobScraperProps) {
  const [state, dispatch] = useReducer(scraperReducer, {
    inputText: "",
    urlText: "",
    loading: false,
    statusMessage: "",
    successJob: null,
    errorMsg: "",
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state.loading) {
      let step = 0;
      dispatch({ type: "SET_STATUS", payload: statusPhases[0] });
      interval = setInterval(() => {
        step = (step + 1) % statusPhases.length;
        dispatch({ type: "SET_STATUS", payload: statusPhases[step] });
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [state.loading]);

  const handlePasteSampleText = () => {
    const sampleText = `Senior Web Engineer — TechCorp.
We are looking for a senior front-end software developer to lead the implementation of our design systems.
This is a 100% remote job. Since our software engineering team communicates exclusively via asynchronous Slack updates, GitHub pull requests, and Jira tickets, we do not require verbal voice calls or spoken standup meetings.
We are committed to building an inclusive workplace. We fully support screen-reader technologies (e.g. JAWS, NVDA) and provide a comprehensive assistive hardware stipend to purchase any customized keyboards or tracking gear.`;
    dispatch({ type: "SET_INPUT", payload: sampleText });
    dispatch({ type: "RESET" });
  };

  const handleClassifyJob = async () => {
    if (!state.inputText.trim() || state.inputText.trim().length < 20) {
      dispatch({ type: "SET_ERROR", payload: "Please provide a substantial job description (at least 20 characters) to parse." });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "RESET" });

    try {
      const response = await fetch("/api/add-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescriptionText: state.inputText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to parse listing.");
      }

      const parsedJob: Job = await response.json();
      dispatch({ type: "SET_SUCCESS", payload: parsedJob });
      onJobAdded(parsedJob);
      dispatch({ type: "SET_INPUT", payload: "" });
    } catch (err: any) {
      console.error(err);
      dispatch({ type: "SET_ERROR", payload: err.message || "An unexpected error occurred during classification." });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleScrapeUrl = async () => {
    if (!state.urlText.trim()) {
      dispatch({ type: "SET_ERROR", payload: "Please provide a valid URL." });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "RESET" });

    try {
      const response = await fetch("/api/trigger-scraper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: state.urlText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to scrape listing.");
      }

      const parsedJob: Job = await response.json();
      dispatch({ type: "SET_SUCCESS", payload: parsedJob });
      onJobAdded(parsedJob);
      dispatch({ type: "SET_URL", payload: "" });
    } catch (err: any) {
      console.error(err);
      dispatch({ type: "SET_ERROR", payload: err.message || "An unexpected error occurred during scraping." });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <JobScraperHeader highContrast={highContrast} />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <JobScraperInput 
          state={state} 
          dispatch={dispatch} 
          handlePasteSampleText={handlePasteSampleText} 
          handleClassifyJob={handleClassifyJob} 
          handleScrapeUrl={handleScrapeUrl}
          highContrast={highContrast} 
        />
        <JobScraperResult state={state} highContrast={highContrast} />
      </div>
    </div>
  );
}
