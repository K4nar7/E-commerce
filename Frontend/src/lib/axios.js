import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" 
        ? "http://localhost:5000/api" 
        : "https://e-commerce-0ro2.onrender.com/api",
    withCredentials: true,
});

// Prevent showing unauthorized error on initial auth check
let isInitialAuthCheck = true;

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && isInitialAuthCheck) {
            isInitialAuthCheck = false;
            return Promise.reject(error);
        }
        isInitialAuthCheck = false;
        return Promise.reject(error);
    }
);

export default axiosInstance;