import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import NavBar from "./navbar";
import Hero from "./hero";
import Footer from "./footer";
import axios from "axios";

function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("access_token"); // Get token
        const storedUser = localStorage.getItem("user"); // Retrieve user object

        if (!storedUser) {
          throw new Error("User not found in localStorage");
        }

        const parsedUser = JSON.parse(storedUser);
        const userId = parsedUser?.user_id;

        if (!userId) {
          throw new Error("User ID not found");
        }

        let response;
        if (["faculty", "dean_student"].includes(parsedUser?.role)) {
          // Fetch faculty profile
          response = await axios.get(
            `http://127.0.0.1:8000/auth/faculty/profile/`, // Ensure the correct endpoint
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Check if the response is an empty array
          if (Array.isArray(response.data) && response.data.length === 0) {
            navigate("/home/profile/faculty"); // Redirect to faculty profile creation
            return; // Stop further execution
          }
        } else if (parsedUser.role === "student") {
          // Fetch student profile
          response = await axios.get(
            `http://127.0.0.1:8000/auth/StudentProfileDetail/`, // Ensure the correct endpoint
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Check if the response is an empty array
          if (Array.isArray(response.data) && response.data.length === 0) {
            navigate("/home/profile/student"); // Redirect to student profile creation
            return; // Stop further execution
          }
        } else {
          throw new Error("Invalid user role");
        }

        setUser(response.data); // Set user data
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          // If the student profile is not found, navigate to the student profile creation page
          const storedUser = localStorage.getItem("user");
          const parsedUser = storedUser ? JSON.parse(storedUser) : null;

          if (parsedUser?.role === "student") {
            navigate("/home/profile/student");
          } else if (["faculty", "dean_student"].includes(parsedUser?.role)) {
            navigate("/home/profile/faculty");
          }
        } else {
          setError("Failed to fetch user data.");
          console.error(err); // Log the error for debugging
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]); // Add navigate to the dependency array

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error state
  }

  return (
    <div>
      <NavBar />
      <Hero />
      <Footer />
    </div>
  );
}

export default Home;