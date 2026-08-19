import { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import AuthContext from "../context/AuthContext.jsx";
import api from "../api/axios.js";

function Register() {
  const navigate = useNavigate();

  const { accessToken, setAccessToken } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (accessToken) {
      navigate("/dashboard");
    }
  }, [accessToken, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await api.post("/auth/register", {
        username,
        email,
        password,
      });

      toast.success("Successfully Registered");
      console.log("Successfully Registered");
      navigate("/dashboard");

      setAccessToken(data.accessToken);
    } catch (err) {
      toast.error("Invalid email or password");
      console.error(err.message, "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-rotate text-5xl mb-8 duration-6000">
        <span>
          <span>WRITE</span>
          <span>IMPLEMENT</span>
          <span>PERSEVERE</span>
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <legend className="fieldset-legend">Register</legend>

          <label className="label">Username</label>

          <input
            type="text"
            className="input w-full"
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <label className="label">Email</label>

          <input
            type="email"
            className="input w-full"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <label className="label">Password</label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="input w-full pr-12"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            <button
              type="button"
              className="btn btn-ghost btn-sm absolute right-1 top-1/2 -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button className="btn btn-neutral mt-4" type="submit">
            Register
          </button>
        </fieldset>
        <p className="text-sm text-center mt-4 text-base-content/60">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-semibold hover:underline"
          >
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
