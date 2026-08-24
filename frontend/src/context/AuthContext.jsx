import { createContext, useMemo, useEffect, useState } from "react";
import {
  setAuthToken,
  setupInterceptors,
  refreshAccessToken,
} from "../api/axios.js";
import api from "../api/axios.js";

import logger from "../utils/logger.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAuthToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const newAccessToken = await refreshAccessToken();

        setAccessToken(newAccessToken);
      } catch (error) {
        setAccessToken(null);
        logger.error(error.message, "Error getting a new access token");
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  useEffect(() => {
    const interceptorId = setupInterceptors(setAccessToken);

    return () => api.interceptors.response.eject(interceptorId);
  }, []);

  const contextValue = useMemo(
    () => ({
      accessToken,
      setAccessToken,
      loading,
    }),
    [accessToken, loading],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export default AuthContext;
