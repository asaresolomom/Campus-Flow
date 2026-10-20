
import axios from "axios";

const API = axios.create({
    baseURL: "https://campus-flow-api-fnc2.onrender.com/api"
});

// Add token automatically
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default API;
