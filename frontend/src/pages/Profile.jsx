import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api, { setAuthToken } from "../api/axios.js";
import AuthContext from "../context/AuthContext.jsx";
import logger from "../utils/logger.js";
import toast from "react-hot-toast";

function Profile() {
  const [user, setUser] = useState(null);
  const [numberOfNotes, setNumberOfNotes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const { setAccessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const userRes = await api.get("/auth/me");
        setUser(userRes.data.user);

        const notesRes = await api.get("/notes");
        setNumberOfNotes(notesRes.data.notes.length);
      } catch (err) {
        toast.error("Error loading Profile");
        logger.error("Error loading profile", err);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await api.post("/auth/logout");

      setAccessToken(null);
      setAuthToken(null);

      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      toast.error("Error logging out");
      logger.error("Error logging out", err);
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[80vh] flex items-center justify-center">
          <span className="loading loading-spinner loading-lg" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-base-content/60 mt-1">Your account information.</p>
        </div>

        <div className="rounded-2xl border border-base-300 bg-base-100 shadow-md overflow-hidden">
          <div className="flex items-center gap-4 px-6 py-6 border-b border-base-300">
            <div>
              <h2 className="text-xl font-bold">{user?.username}</h2>
              <p className="text-sm text-base-content/60">{user?.email}</p>
            </div>
          </div>

          <dl className="divide-y divide-base-300">
            <div className="py-4 px-6 grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-base-content/60">
                Username
              </dt>
              <dd className="text-sm col-span-2">{user?.username}</dd>
            </div>

            <div className="py-4 px-6 grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-base-content/60">
                Email address
              </dt>
              <dd className="text-sm col-span-2">{user?.email}</dd>
            </div>

            <div className="py-4 px-6 grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-base-content/60">
                Active Notes
              </dt>
              <dd className="text-sm col-span-2">{numberOfNotes}</dd>
            </div>
          </dl>

          <div className="px-6 py-4 border-t border-base-300 flex justify-end">
            <button
              type="button"
              className="btn btn-sm bg-amber-600 text-white hover:bg-amber-700 border-amber-600"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? (
                <>
                  <span className="loading loading-spinner loading-xs" />
                  Logging out...
                </>
              ) : (
                "Log Out"
              )}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

export default Profile;
