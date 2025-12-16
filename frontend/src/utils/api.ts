import axios from "axios";
import type { PortfolioContext, ContactSubmission } from "@portfolio/shared";

const API_URL = (import.meta.env.VITE_API_URL as string) || "http://localhost:5000/api";

// Add auth token to requests
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Context API
export async function getContext(): Promise<PortfolioContext> {
  const response = await apiClient.get<PortfolioContext>("/context");
  return response.data;
}

export async function updateContext(updates: Partial<PortfolioContext>): Promise<void> {
  await apiClient.post("/context/update", updates);
}

// Chat API
export async function sendChatMessage(
  messages: Array<{ role: "user" | "assistant"; content: string }>
): Promise<string> {
  const response = await apiClient.post<{ response: string }>("/chat", {
    messages
  });
  return response.data.response;
}

export async function askQuestion(question: string): Promise<string> {
  const response = await apiClient.post<{ response: string }>("/chat/ask", {
    question
  });
  return response.data.response;
}

// Contact API
export async function submitContact(data: {
  name: string;
  designation: string;
  message: string;
  socialHandle?: string;
}): Promise<{ success: boolean; message: string; submissionId: string }> {
  const response = await apiClient.post("/contact/submit", data);
  return response.data;
}

// Admin Auth API
export async function googleLogin(credential: string): Promise<{ 
  success: boolean; 
  token: string; 
  message: string;
  user: { email: string; name: string };
}> {
  const response = await apiClient.post("/auth/google", { credential });
  return response.data;
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
}

export async function verifyAuth(): Promise<{ authenticated: boolean; user: any }> {
  const response = await apiClient.get("/auth/verify");
  return response.data;
}

// Admin Contact API
export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  const response = await apiClient.get<ContactSubmission[]>("/contact/submissions");
  return response.data;
}

export async function markAsRead(id: string): Promise<void> {
  await apiClient.patch(`/contact/${id}/read`);
}

export async function deleteSubmission(id: string): Promise<void> {
  await apiClient.delete(`/contact/${id}`);
}

// Upload API removed - using static files only

