import React, { useState, useEffect } from "react";
import axios from "axios";

function ElectionResults() {
  const [electionPosts, setElectionPosts] = useState([]); // State to store election posts
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [userRole, setUserRole] = useState(null); // State to store user role
  const [selectedPostId, setSelectedPostId] = useState(null); // State to store the selected election post ID
  const [leaderboardData, setLeaderboardData] = useState(null); // State to store leaderboard data
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  // Fetch user role from localStorage on component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role) {
      setUserRole(user.role);
    }
  }, []);

  // Fetch election posts from the API
  useEffect(() => {
    const fetchElectionPosts = async () => {
      try {
        const accessToken = localStorage.getItem("access_token"); // Get access token from localStorage
        if (!accessToken) {
          throw new Error("No access token found. Please log in.");
        }

        // Fetch election posts from the API
        const response = await axios.get(
          "https://xeropages.onrender.com/election/electionposts/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setElectionPosts(response.data); // Update state with fetched election posts
        setLoading(false); // Set loading to false
      } catch (err) {
        setError(err.message); // Set error message
        setLoading(false); // Set loading to false
      }
    };

    fetchElectionPosts(); // Call the function to fetch election posts
  }, []);

  // Handle "Start Counting" button click
  const handleStartCounting = async (electionId) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        throw new Error("No access token found. Please log in.");
      }

      // Make a POST request to start counting
      const response = await axios.post(
        `https://xeropages.onrender.com/election/start_counting/`,
        { post_id: electionId }, // Send the election ID in the request body
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Counting started! Leaderboard initialized.");
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Handle election post card click to open modal
  const handleCardClick = (electionId) => {
    setSelectedPostId(electionId); // Set the selected election post ID
    setIsModalOpen(true); // Open the modal
  };

  // Fetch leaderboard data every 5 seconds when modal is open
  useEffect(() => {
    let intervalId;
    if (isModalOpen && selectedPostId) {
      const fetchLeaderboardData = async () => {
        try {
          const accessToken = localStorage.getItem("access_token");
          if (!accessToken) {
            throw new Error("No access token found. Please log in.");
          }

          // Fetch leaderboard data from the API
          const response = await axios.get(
            `https://xeropages.onrender.com/election/leaderboard/${selectedPostId}/`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          setLeaderboardData(response.data.leaderboard); // Update state with fetched leaderboard data
        } catch (err) {
          console.error("Error fetching leaderboard data:", err.message);
        }
      };

      // Fetch data immediately and then every 5 seconds
      fetchLeaderboardData();
      intervalId = setInterval(fetchLeaderboardData, 5000);
    }

    // Clear interval when modal is closed or component unmounts
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isModalOpen, selectedPostId]);

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setLeaderboardData(null); // Reset leaderboard data
  };

  return (
    <div className="election-results p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">Election Results 2025</h1>
      <p className="text-gray-600 mb-6">Final results from all constituencies</p>

      {/* Display loading or error messages */}
      {loading ? (
        <p className="text-center text-gray-500">Loading election posts...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : (
        <>
          {/* Election Posts Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {electionPosts.map((post) => (
              <div
                key={post.id}
                className="election-card bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => handleCardClick(post.id)} // Handle card click
              >
                {/* Election Title */}
                <h2 className="text-xl font-bold mb-2 text-gray-800">
                  {post.position}
                </h2>

                {/* Election Description */}
                {post.description && (
                  <p className="text-gray-600 mb-4">{post.description}</p>
                )}

                {/* Election Dates */}
                <div className="text-sm text-gray-500 mb-4">
                  {post.date_posted && (
                    <p>
                      <span className="font-semibold">Date Posted:</span>{" "}
                      {new Date(post.date_posted).toLocaleDateString()}
                    </p>
                  )}
                  {post.candidate_registration_deadline && (
                    <p>
                      <span className="font-semibold">Registration Deadline:</span>{" "}
                      {new Date(post.candidate_registration_deadline).toLocaleDateString()}
                    </p>
                  )}
                  {post.voting_day && (
                    <p>
                      <span className="font-semibold">Voting Day:</span>{" "}
                      {new Date(post.voting_day).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* Start Counting Button (visible only for dean_student) */}
                {userRole === "dean_student" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click event
                      handleStartCounting(post.id);
                    }}
                    className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
                  >
                    Start Counting
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal for Leaderboard */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>

            {/* Leaderboard Table */}
            {leaderboardData ? (
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="py-2">Candidate</th>
                    <th className="py-2">Votes</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(leaderboardData).map(([candidate, votes]) => (
                    <tr key={candidate}>
                      <td className="py-2">{candidate}</td>
                      <td className="py-2">{votes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-500">Loading leaderboard data...</p>
            )}

            {/* Close Modal Button */}
            <button
              onClick={closeModal}
              className="mt-4 w-full bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition-colors duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ElectionResults;