import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../../utils/api";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Auto redirect if already logged in
  useEffect(() => {
    const user = localStorage.getItem("campusUser");
    if (user) {
      const parsed = JSON.parse(user);
      redirectByRole(parsed.role);
    }
  }, []);

  const redirectByRole = (role) => {
    if (role === "admin") navigate("/admin/dashboard");
    else if (role === "teacher") navigate("/teacher/dashboard");
    else navigate("/dashboard");
  };

  const handleForm = async (e) => {
    e.preventDefault();
    setError("");
    console.log("Login attempt started");
    console.log(" Email:", email);
    console.log("Password:", password ? "***" : "empty");
    try {
      setLoading(true);
      console.log("🌐 API URL:", API.defaults.baseURL);
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      console.log(" Response received:", res);
      console.log(" Response data:", res.data);
      console.log(" User data:", res.data.user);
      console.log(" User role:", res.data.user?.role);

      const { user, token } = res.data;
      console.log("Saved to localStorage");
      console.log("Token:", token);

      localStorage.setItem("campusUser", JSON.stringify(user));
      localStorage.setItem("token", token);

      toast.success("Login Successful");
      redirectByRole(user.role);
    } catch (err) {
      console.error(" Login error:", err);
      console.error(" Error response:", err?.response);
      console.error(" Error data:", err?.response?.data);
      console.error(" Error message:", err?.message);
      setError(err?.response?.data?.error || "Login Failed");
      toast.error("Login Failed", err);
    } finally {
      setLoading(false);
      console.log(" Login attempt finished");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleForm}
        className="bg-white w-full max-w-md p-8 rounded shadow"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Campus Notes Login
        </h2>

        {error && (
          <p className="bg-red-100 text-red-600 p-2 rounded mb-4">{error}</p>
        )}

        <input
          type="email"
          value={email}
          placeholder="Email"
          className="w-full border p-2 rounded mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            placeholder="Password"
            className="w-full border p-2 rounded"
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="absolute right-3 top-3 cursor-pointer text-sm"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <button
          className="w-full bg-blue-600 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm mt-4">
          Don’t have an account?
          <Link to="/register" className="text-blue-600 ml-1">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
