import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import API from "../api";
import { useAtom } from "jotai";
import { sessionAtom } from "@/atoms/session";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [, setSession] = useAtom(sessionAtom);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      let response = await attemptAdminLogin(email, password);
  
      if (response?.data?.token) {
        handleSuccessfulLogin(response.data, "admin");
        return;
      }
  
      console.log("Admin login failed, attempting student login...");
  
      response = await attemptStudentLogin(email, password);
  
      if (response?.data?.token) {
        handleSuccessfulLogin(response.data, "student");
        return;
      }
  
      console.log("Student login failed, attempting mentor login...");
  
      response = await attemptMentorLogin(email, password);
  
      if (response?.data?.token) {
        handleSuccessfulLogin(response.data, "mentor");
        return;
      }
  
      throw new Error("Invalid credentials. Please try again.");
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const attemptAdminLogin = async (email, password) => {
    try {
      const response = await API.post("/admin/login", { email, password });
      return response;
    // eslint-disable-next-line no-unused-vars
    } catch (adminError) {
      return null;
    }
  };
  
  const attemptStudentLogin = async (email, password) => {
    try {
      const response = await API.post("/student/login", { email, password });
      return response;
    // eslint-disable-next-line no-unused-vars
    } catch (studentError) {
      return null; // Return null on error
    }
  };
  
  const attemptMentorLogin = async (email, password) => {
    try {
      const response = await API.post("/mentor/login", { email, password });
      return response;
    // eslint-disable-next-line no-unused-vars
    } catch (mentorError) {
      return null; // Return null on error
    }
  };
  
  const handleSuccessfulLogin = (user, role) => {
    if (!user || !user.token) {
      console.error("Invalid response from server:", user);
      throw new Error("Invalid response from server. User data is missing.");
    }
  
    let sessionData = {
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: role,
      token: user.token,
    };
  
    if (role === "admin") {
      console.log("Admin login detected.");
      sessionData = { role: "admin", token: user.token };
    }
  
    // Save session data
    localStorage.setItem("session", JSON.stringify(sessionData));
  
    // Update session state
    setSession(sessionData);
    toast.success(
      role === "admin"
        ? "Welcome, Admin"
        : `Welcome back, ${user.firstname} ${user.lastname}`
    );
  
    // Redirect based on role
    if (role === "admin") navigate("/adminDashboard");
    else navigate("/");
  };
  

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('./src/Img/authentication_background.png')" }}
    >
      <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-blue-500 hover:underline">
                Sign up here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
