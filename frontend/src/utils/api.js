import axios from "axios";
// Ensure baseURL always ends with /api
let baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
// Remove trailing slash then ensure /api is at the end
baseURL = baseURL.replace(/\/$/, "");
if (!baseURL.endsWith("/api")) {
    baseURL = baseURL + "/api";
}
console.log("API baseURL:", baseURL);
// Add auth token to requests
export const apiClient = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 30000 // 30 second timeout
});
// Interceptor to add auth token
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
// Retry logic for backend cold starts
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
// Apply retry interceptor to response errors
apiClient.interceptors.response.use((response) => response, async (error) => {
    const config = error.config;
    // Don't retry if already retried (prevent infinite loops)
    if (config.__retried) {
        return Promise.reject(error);
    }
    const isRetryable = error.code === "ECONNREFUSED" ||
        error.code === "ECONNRESET" ||
        error.code === "ETIMEDOUT" ||
        error.code === "ENOTFOUND" ||
        (error.response?.status >= 500 && error.response?.status < 600);
    if (isRetryable) {
        config.__retried = true;
        console.warn(`Backend connection failed, retrying... (${MAX_RETRIES}/${MAX_RETRIES})`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        return apiClient(config);
    }
    return Promise.reject(error);
});
// Context API
export async function getContext() {
    const response = await apiClient.get("/context");
    return response.data;
}
export async function updateContext(updates) {
    await apiClient.post("/context/update", updates);
}
// Chat API
export async function sendChatMessage(messages) {
    const response = await apiClient.post("/chat", {
        messages
    });
    return response.data.response;
}
export async function askQuestion(question) {
    const response = await apiClient.post("/chat/ask", {
        question
    });
    return response.data.response;
}
// Contact API
export async function submitContact(data) {
    const response = await apiClient.post("/contact/submit", data);
    return response.data;
}
// Admin Auth API
export async function googleLogin(credential) {
    const response = await apiClient.post("/auth/google", { credential });
    return response.data;
}
export async function logout() {
    await apiClient.post("/auth/logout");
}
export async function verifyAuth() {
    const response = await apiClient.get("/auth/verify");
    return response.data;
}
// Admin Contact API
export async function getContactSubmissions() {
    const response = await apiClient.get("/contact/submissions");
    return response.data;
}
export async function markAsRead(id) {
    await apiClient.patch(`/contact/${id}/read`);
}
export async function deleteSubmission(id) {
    await apiClient.delete(`/contact/${id}`);
}
// Upload API removed - using static files only
