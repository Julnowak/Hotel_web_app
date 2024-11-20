import axios from "axios";

// Global Axios Config
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

// Custom Axios Instance
const client = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://127.0.0.1:3000",
    timeout: 10000, // 10-second timeout
});

// Interceptors for Global Error Handling
client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error("Unauthorized access, redirecting...");
            // Redirect to login or handle unauthorized error
        }
        return Promise.reject(error);
    }
);

export default client;
