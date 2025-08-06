import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async (event) => {
    event.preventDefault();

    const userData = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post("https://xeropages.onrender.com/auth/login/", userData);

      if (response.status === 200) {
        const { user, access_token } = response.data;

        // Store user data and access token in localStorage
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("access_token", access_token);

        // Redirect to the home page
        navigate("/home");
      } else {
        setError("Incorrect email or password");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("Incorrect email or password");
      } else if (error.response && error.response.status === 404) {
        setError("User not found");
      } else {
        setError("An error occurred. Please try again.");
      }
      console.error("Login error:", error);
    }
  };

  const handleAdminLogin = () => {
    // Redirect to the Django admin panel
    window.location.href = "https://xeropages.onrender.com/admin";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg h-[500px] flex flex-col justify-center">
        <h2 className="text-3xl font-semibold text-gray-900 text-center mb-6">Sign In</h2>
        <p className="text-sm text-gray-600 text-center mb-8">
          Sign in and manage college activities hassle-free
        </p>

        {error && <div className="mb-4 text-center text-red-600">{error}</div>}

        <form className="flex flex-col space-y-6" onSubmit={handleSignIn}>
          <input
            type="email"
            placeholder="Enter college email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full p-3 text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none"
          >
            Sign In
          </button>
        </form>
        <button
          onClick={handleAdminLogin}
          className="w-full p-3 text-white bg-gray-900 rounded-full hover:bg-gray-700 focus:outline-none mt-[10px]"
        >
          Login as Admin
        </button>
      </div>
    </div>
  );
}

export default Login;