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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (accessToken) {
      navigate("/dashboard");
    }
  }, [accessToken, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);

      const { data } = await api.post("/auth/register", {
        username,
        email,
        password,
      });

      toast.success("Successfully Registered");
      setAccessToken(data.token.accessToken);
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("Email already exists");
      } else if (err.response?.status === 400) {
        toast.error("Password length should be atleast 8 characters");
      } else {
        toast.error("Something went wrong");
      }
      console.error(err.message, "Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="flex items-center gap-2 mb-8">
        <span className="text-2xl font-bold">MyNotes</span>
      </div>

      <div className="w-full max-w-sm rounded-2xl border border-base-300 bg-base-100 shadow-md overflow-hidden">
        <div className="px-6 py-5 border-b border-base-300">
          <h1 className="text-xl font-bold">Create an account</h1>
          <p className="text-sm text-base-content/60 mt-1">
            Start capturing your thoughts and ideas.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label htmlFor="username" className="label">
              <span className="label-text">Username</span>
            </label>
            <input
              id="username"
              type="text"
              className="input input-bordered w-full"
              placeholder="Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label htmlFor="email" className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              id="email"
              type="email"
              className="input input-bordered w-full"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="label">
              <span className="label-text">
                Password with at least 8 characters
              </span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="input input-bordered w-full pr-12"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="new-password"
              />

              <button
                type="button"
                className="btn btn-ghost btn-sm absolute right-1 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            className="btn btn-primary mt-2"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm mr-2" />
                <span>Registering...</span>
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>
      </div>

      <p className="text-sm text-center mt-6 text-base-content/60">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-primary font-semibold hover:underline"
        >
          Log In
        </Link>
      </p>
    </div>
  );
}

export default Register;
