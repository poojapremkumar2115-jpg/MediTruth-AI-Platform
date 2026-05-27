const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export interface PredictionResponse {
  prediction: "REAL" | "FAKE";
  confidence: number;
  explanation: string;
  risk_level_score: number;
  risk_level_category: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  medical_keywords: string[];
  suspicious_keywords: string[];
  fake_patterns: Array<{ pattern: string; description: string }>;
  nlp_tokens: Array<{ text: string; type: "standard" | "medical" | "suspicious" }>;
  scan_id: number;
  email: string;
}

export interface StatsResponse {
  total_scans: number;
  real_count: number;
  fake_count: number;
  avg_confidence: number;
  recent_activity: Array<{ prediction: string; timestamp: string }>;
}

export const api = {
  predict: async (text: string, email: string = "guest@meditruth.ai"): Promise<PredictionResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, email }),
    });
    if (!response.ok) throw new Error("API scan failed.");
    return response.json();
  },

  getHistory: async (email: string): Promise<{ history: any[] }> => {
    const response = await fetch(`${API_BASE_URL}/api/history?email=${encodeURIComponent(email)}`);
    if (!response.ok) throw new Error("API history lookup failed.");
    return response.json();
  },

  getStats: async (): Promise<StatsResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/stats`);
    if (!response.ok) throw new Error("API stats compile failed.");
    return response.json();
  },

  chat: async (message: string): Promise<{ reply: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/chatbot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    if (!response.ok) throw new Error("API chatbot communication failed.");
    return response.json();
  },

  submitFeedback: async (scanId: number, rating: "helpful" | "unhelpful", comment: string = ""): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scan_id: scanId, rating, comment }),
    });
    if (!response.ok) throw new Error("API review submit failed.");
    return response.json();
  },

  uploadDataset: async (file: File): Promise<{
    total_scans: number;
    real_count: number;
    fake_count: number;
    avg_confidence: number;
    results: Array<{
      text: string;
      prediction: "REAL" | "FAKE";
      confidence: number;
      risk_level: number;
      explanation: string;
      suggested_label: number;
    }>;
  }> => {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await fetch(`${API_BASE_URL}/api/upload-dataset`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("API dataset upload failed.");
    return response.json();
  },

  retrain: async (dataset: Array<{ text: string; label: number }>): Promise<{ status: string; message: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/retrain`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataset }),
    });
    if (!response.ok) throw new Error("API model retraining failed.");
    return response.json();
  }
};
