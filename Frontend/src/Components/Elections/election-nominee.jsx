import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavBar from '../Homepage/navbar';
import Footer from '../Homepage/footer';

function ElectionNominee() {
  const { nomineeName } = useParams(); // Fetch nomineeName from URL params
  const navigate = useNavigate();

  // Simulated data for the specific nominee
  const nomineeData = {
    name: nomineeName, // Use the nomineeName from params
    description: "A passionate candidate with a vision for change.",
    status: "Approved",
    post: "CS",
    competitors: [
      { name: "Prasad Chede", votes: 20 },
      { name: "Jane Smith", votes: 15 },
    ],
  };

  const handleVote = () => {
    alert(`Voted for ${nomineeData.name}`);
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
          {/* Nominee Details Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg p-6 mb-8"
          >
            <h1 className="text-4xl font-bold mb-4">Vote for Candidate</h1>
            <h2 className="text-2xl font-semibold mb-4">{nomineeData.name}</h2>
            <p className="text-gray-600 mb-4">{nomineeData.description}</p>
            <p className="text-gray-600">Status: {nomineeData.status}</p>
            <p className="text-gray-600">Post: {nomineeData.post}</p>
            <button
              onClick={handleVote}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full w-full hover:bg-blue-700 transition-colors duration-300"
            >
              Vote for Candidate
            </button>
          </motion.div>

          {/* Competitors Section */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg p-6 mb-8"
          >
            <h2 className="text-2xl font-semibold mb-6">Competitors for {nomineeData.post}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {nomineeData.competitors.map((competitor, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 rounded-lg shadow-md p-4"
                >
                  <h3 className="text-xl font-bold mb-2">{competitor.name}</h3>
                  <p className="text-gray-600">Votes: {competitor.votes}</p>
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

export default ElectionNominee;