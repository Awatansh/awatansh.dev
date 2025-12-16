import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
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
