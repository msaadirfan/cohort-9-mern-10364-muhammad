import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
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
    const response = await api.post("/auth/refresh-token");
    return response.data.accessToken;
}

export function setupInterceptors(setAccessToken) {
    api.interceptors.response.use(
        (response) => {
            return response;
        },

        async (error) => {
            const originalRequest = error.config;

            if (error.response?.status !== 401) {
                return Promise.reject(error);
            }

            if (originalRequest._retry) {
                return Promise.reject(error);
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

                return Promise.reject(refreshError);
            }
        }
    );
}


export default api;