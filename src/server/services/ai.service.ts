import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({ apiKey: key });
    }
  }
  return aiClient;
}

export async function callOpenRouter(prompt: string, system: string = "", model: string = "meta-llama/llama-3-8b-instruct:free", jsonMode = false) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key || key === "MY_OPENROUTER_API_KEY") throw new Error("OpenRouter API key missing");
  
  const messages = [];
  if (system) messages.push({ role: "system", content: system });
  messages.push({ role: "user", content: prompt });
  
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      messages,
      response_format: jsonMode ? { type: "json_object" } : undefined
    })
  });
  
  if (!res.ok) throw new Error(`OpenRouter Error: ${await res.text()}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

export async function callOpenRouterMessages(messages: any[], model: string = "meta-llama/llama-3-8b-instruct:free") {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key || key === "MY_OPENROUTER_API_KEY") throw new Error("OpenRouter API key missing");

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      messages,
    })
  });
  
  if (!res.ok) throw new Error(`OpenRouter Error: ${await res.text()}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

export async function callGroq(prompt: string, system: string = "", jsonMode = false) {
  const key = process.env.GROQ_API_KEY;
  if (!key || key === "MY_GROQ_API_KEY") throw new Error("Groq API key missing");

  const messages = [];
  if (system) messages.push({ role: "system", content: system });
  messages.push({ role: "user", content: prompt });

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      messages,
      response_format: jsonMode ? { type: "json_object" } : undefined
    })
  });

  if (!res.ok) throw new Error(`Groq Error: ${await res.text()}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

export async function callMistral(messages: any[]) {
  const key = process.env.MISTRAL_API_KEY;
  if (!key || key === "MY_MISTRAL_API_KEY") throw new Error("Mistral API key missing");

  const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      model: "mistral-small-latest",
      messages
    })
  });

  if (!res.ok) throw new Error(`Mistral Error: ${await res.text()}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

export async function generateEmbeddingsHF(text: string) {
  const token = process.env.HF_TOKEN;
  if (!token || token === "MY_HF_TOKEN") throw new Error("HF Token missing");

  const res = await fetch("https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inputs: text })
  });

  if (!res.ok) throw new Error(`HF Error: ${await res.text()}`);
  return await res.json();
}
