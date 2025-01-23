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
  const navigate = useNavigate();
  const [, setSession] = useAtom(sessionAtom); // Accessing the atom state

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
  
    try {
      const response = await API.post("/users/login", { email, password });
  
      // Log the response for debugging purposes
      console.log(response);
  
      // Assuming response contains the user data directly
      const user = response.data;
      
      if (!user || !user.role) {
        throw new Error("Invalid response from server. User data is missing.");
      }
  
      // Save session data to localStorage
      localStorage.setItem("session", JSON.stringify(response.data));
      setSession(response.data);
  
      // Redirect based on user role
      switch (user.role) {
        case "admin":
          toast.success(`Welcome back, ${user.firstname} ${user.lastname}`);
          navigate("/adminDashboard");
          break;
        case "mentor":
          toast.success(`Welcome back, ${user.firstname} ${user.lastname}`);
          navigate("/mentorDashboard");
          break;
        case "student":
          toast.success(`Welcome back, ${user.firstname} ${user.lastname}`);
          navigate("/");
          break;
        default:
          toast.error("Unknown role. Please contact support.");
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      console.error(err.message || err);
    }
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
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300"
          >
            Login
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
