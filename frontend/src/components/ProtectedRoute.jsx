import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext.jsx";

function ProtectedRoute({ children }) {

    const { accessToken, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;