import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavBar from '../Homepage/navbar';
import Footer from '../Homepage/footer';

function ElectionPost() {
  const { postTitle } = useParams();
  const navigate = useNavigate();

  // Simulated data for the specific election post
  const electionPost = {
    title: postTitle,
    description: "Class Representative for Computer Science Department",
    totalVoters: 75,
    candidates: [
      { name: "Shreya Kore", votes: 33 },
      { name: "Prasad", votes: 20 },
    ],
    approvedNominees: [
      { name: "Shreya Kore", post: "CS", status: "Approved" },
    ],
    pendingNominees: [
      { name: "Me Nahin Sangat Kon", post: "CS", status: "Pending" },
    ],
  };

  const [approvedNominees, setApprovedNominees] = useState(electionPost.approvedNominees);
  const [pendingNominees, setPendingNominees] = useState(electionPost.pendingNominees);

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
            <h1 className="text-4xl font-bold mb-4">{electionPost.title}</h1>
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
            <p className="text-3xl font-bold text-blue-600">{electionPost.totalVoters}</p>
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
            {electionPost.candidates.map((candidate, index) => (
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