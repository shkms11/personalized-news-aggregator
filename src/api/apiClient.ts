import axios from "axios";

const apiClient = axios.create({
    baseURL: "https://jsonplaceholder.typicode.com", // mock API for testing
    headers: {
        "Content-type": "application/json",
    },
    timeout: 10000,
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        console.log("Outgoing request", config);
        return config;
    },
    (error) => {
        //handle req error
        console.error("Request error", error);
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        console.log("Incoming response", response);
        return response.data;
    },
    (error) => {
        if (error.response) {
            console.error(
                "Response Error:",
                error.response.status,
                error.response.data
            );
            if (error.response.status === 401) {
                // redirect to login if unauthorized
                window.location.href = "/login";
            }
        } else {
            console.error("Network error", error);
        }
        return Promise.reject(error);
    }
);

export default apiClient;
