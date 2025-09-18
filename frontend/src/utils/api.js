// API configuration utility
const getApiUrl = () => {
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
    // Remove trailing slash if present
    return baseUrl.replace(/\/$/, '');
};

export const API_BASE = getApiUrl();

// Helper function to construct API URLs
export const apiUrl = (path) => {
    let cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE}${cleanPath}`;
};

export default {
    API_BASE,
    apiUrl
};