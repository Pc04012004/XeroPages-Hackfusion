import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios'; // Import axios for API calls
import NavBar from '../Homepage/navbar';
import Footer from '../Homepage/footer';

function ElectionPost() {
  const { postTitle } = useParams();
  const navigate = useNavigate();
  const [electionPost, setElectionPost] = useState(null); // State to store the filtered post
  const [totalVoters, setTotalVoters] = useState(0); // State to store the total number of voters
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors

  // Fetch election posts from the API
  useEffect(() => {
    const fetchElectionPosts = async () => {
      try {
        const accessToken = localStorage.getItem('access_token'); // Retrieve the access token from localStorage
        if (!accessToken) {
          throw new Error('No access token found. Please log in.');
        }

        const response = await axios.get('http://127.0.0.1:8000/election/electionposts/', {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the access token in the request headers
          },
        });

        // Filter the post whose position matches the postTitle parameter
        const filteredPost = response.data.find(post => post.position === postTitle);
        if (!filteredPost) {
          throw new Error('Election post not found.');
        }

        setElectionPost(filteredPost); // Set the filtered post
        setLoading(false); // Set loading to false after data is fetched
      } catch (err) {
        setError(err.message); // Set error message if API call fails
        setLoading(false); // Set loading to false
      }
    };

    fetchElectionPosts(); // Call the function to fetch election posts
  }, [postTitle]); // Re-run effect if postTitle changes

  // Fetch voters from the API and calculate total voters for the post
  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const accessToken = localStorage.getItem('access_token'); // Retrieve the access token from localStorage
        if (!accessToken) {
          throw new Error('No access token found. Please log in.');
        }

        const response = await axios.get('http://127.0.0.1:8000/election/voterRegister', {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the access token in the request headers
          },
        });

        // Filter voters by post ID
        if (electionPost) {
          const filteredVoters = response.data.filter(voter => voter.post === electionPost.id);
          setTotalVoters(filteredVoters.length); // Set the total number of voters
        }
      } catch (err) {
        console.error('Error fetching voters:', err);
      }
    };

    if (electionPost) {
      fetchVoters(); // Call the function to fetch voters
    }
  }, [electionPost]); // Re-run effect if electionPost changes

  // Simulated data for candidates and nominees (replace with actual data from API if available)
  const [approvedNominees, setApprovedNominees] = useState([
    { name: "Shreya Kore", post: "CS", status: "Approved" },
  ]);
  const [pendingNominees, setPendingNominees] = useState([
    { name: "Me Nahin Sangat Kon", post: "CS", status: "Pending" },
  ]);

  const handleApprove = (name) => {
    const nominee = pendingNominees.find(nominee => nominee.name === name);
    setApprovedNominees([...approvedNominees, nominee]);
    setPendingNominees(pendingNominees.filter(nominee => nominee.name !== name));
  };

  const handleVote = (name) => {
    alert(`Voted for ${name}`);
  };

  // Animation variants for sliding effect
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return <div className="text-center mt-8">Loading election post...</div>; // Show loading message
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">Error: {error}</div>; // Show error message
  }

  if (!electionPost) {
    return <div className="text-center mt-8">Election post not found.</div>; // Show message if post is not found
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Election Post Title and Description */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">{electionPost.position}</h1>
            <p className="text-gray-600">{electionPost.description}</p>
          </motion.div>

          {/* Total Voters Section */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg p-6 mb-8"
          >
            <h2 className="text-2xl font-semibold mb-4">Total Voters</h2>
            <p className="text-3xl font-bold text-blue-600">{totalVoters}</p> {/* Display dynamic voter count */}
          </motion.div>

          {/* Live Leaderboard Section */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-lg p-6 mb-8"
          >
            <h2 className="text-2xl font-semibold mb-6">Live Leaderboard for Candidates</h2>
            {[
              { name: "Shreya Kore", votes: 33 },
              { name: "Prasad", votes: 20 },
            ].map((candidate, index) => (
              <div key={index} className="flex justify-between items-center mb-4">
                <span className="text-lg">{candidate.name}</span>
                <span className="text-lg font-bold text-green-600">{candidate.votes} votes</span>
              </div>
            ))}
          </motion.div>

          {/* Approved Nominees Section */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg shadow-lg p-6 mb-8"
          >
            <h2 className="text-2xl font-semibold mb-6">Registered Approved Election Nominees</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {approvedNominees.map((nominee, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 rounded-lg shadow-md p-4"
                >
                  <h3 className="text-xl font-bold mb-2">{nominee.name}</h3>
                  <p className="text-gray-600">Post: {nominee.post}</p>
                  <p className="text-gray-600">Status: {nominee.status}</p>
                  <div className="flex space-x-4 mt-4">
                    <button
                      onClick={() => handleVote(nominee.name)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                    >
                      Vote Now
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Pending Nominees Section */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.8 }}
            className="bg-white rounded-lg shadow-lg p-6 mb-8"
          >
            <h2 className="text-2xl font-semibold mb-6">Registered Pending Election Nominees</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingNominees.map((nominee, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 rounded-lg shadow-md p-4"
                >
                  <h3 className="text-xl font-bold mb-2">{nominee.name}</h3>
                  <p className="text-gray-600">Post: {nominee.post}</p>
                  <p className="text-gray-600">Status: {nominee.status}</p>
                  <div className="flex space-x-4 mt-4">
                    <button
                      disabled
                      className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed"
                    >
                      Vote Now
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ElectionPost;