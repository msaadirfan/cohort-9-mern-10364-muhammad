import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});

const refreshClient = axios.create({
    baseURL: api.defaults.baseURL,
    withCredentials: true,
});


export function setAuthToken(accessToken) {
    if (accessToken) {
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
        delete api.defaults.headers.common.Authorization;
    }
}

export async function refreshAccessToken(){
    const response = await refreshClient.post("/auth/refresh-token");
    return response.data.accessToken;
}

export function setupInterceptors(setAccessToken) {
    return api.interceptors.response.use(
        (response) => {
            return response;
        },

        async (error) => {
            const originalRequest = error.config;

            if (error.response?.status !== 401) {
                throw error;
            }

            if (originalRequest._retry) {
                throw error;
            }

            originalRequest._retry = true;

            try {
                const newAccessToken = await refreshAccessToken();

                setAccessToken(newAccessToken);

                setAuthToken(newAccessToken);

                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                return api(originalRequest);

            } catch (refreshError) {

                setAccessToken(null);
                setAuthToken(null);

                throw refreshError;
            }
        }
    );
}


export default api;