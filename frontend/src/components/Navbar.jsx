import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useContext } from "react";
import AuthContext from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

function Navbar() {

  const { setAccessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await api.post("/auth/logout");

      setAccessToken(null);
      navigate("/login");

      toast.success("Successfully logged out");

    } catch (err) {
      toast.error("Failed to logout");
      console.error(err);
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-sm px-6">

      <div className="flex-1">
        <Link
          to="/dashboard"
          className="text-2xl font-bold tracking-tight"
        >
          MyNotes
        </Link>
      </div>


      <div className="dropdown dropdown-end">

        <button
  type="button"
  className="btn btn-ghost btn-circle avatar"
>
  <div aria-label="Open account menu" className="w-10 rounded-full text-2xl">
    ≡
  </div>
</button>


        <ul
          tabIndex="-1"
          className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow-lg"
        >

          <li>
            <Link to="/profile">
              Profile
            </Link>
          </li>

          <li>
            <button onClick={logout}>
              Logout
            </button>
          </li>

        </ul>

      </div>

    </div>
  );
}

export default Navbar;