import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import Framer Motion
import NavBar from '../Homepage/navbar';
import Footer from '../Homepage/footer';

// JSON data defined directly in the component file
const initialElectionData = {
  electionPosts: [
    {
      title: "CS",
      description: "Class Representative for Computer Science Department",
      electionDate: "2025-03-10",
    },
    {
      title: "QS",
      description: "Class Representative for Quality Sciences Department",
      electionDate: "2025-03-12",
    },
    {
      title: "SS",
      description: "Class Representative for Social Sciences Department",
      electionDate: "2025-03-14",
    },
    {
      title: "TS",
      description: "Class Representative for Technical Sciences Department",
      electionDate: "2025-03-16",
    },
    {
      title: "Mess",
      description: "Mess Committee Representative",
      electionDate: "2025-03-18",
    },
  ],
  liveNominees: [
    {
      name: "Sarthak Manapure",
      status: "Approved",
      post: "CS",
    },
    {
      name: "Prasad Chede",
      status: "Approved",
      post: "GS",
    },
    {
      name: "John Doe",
      status: "Pending",
      post: "QS",
    },
    {
      name: "Jane Smith",
      status: "Approved",
      post: "SS",
    },
  ],
};

function ElectionHome() {
  const navigate = useNavigate();
  const [electionData, setElectionData] = useState(initialElectionData);
  const [isAdmin, setIsAdmin] = useState(true); // Simulate admin access (can be fetched from backend)
  const [showForm, setShowForm] = useState(false); // State to toggle the form
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    electionDate: '',
  });

  const handleCardClick = (path) => {
    navigate(path);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedPosts = [...electionData.electionPosts, newPost];
    setElectionData({ ...electionData, electionPosts: updatedPosts });
    setNewPost({ title: '', description: '', electionDate: '' }); // Reset form
    setShowForm(false); // Close the form
  };

  // Animation variants for sliding effect
  const cardVariants = {
    hidden: { opacity: 0, x: -50 }, // Start off-screen to the left
    visible: { opacity: 1, x: 0 }, // Slide in to the center
  };

  return (
    <>
      <NavBar />
      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-4xl font-bold text-center mb-12">Election</h1>

        {/* Register for Elections Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-center mb-6">Register for Elections:</h2>
          <div className="flex justify-center space-x-6">
            <button
              onClick={() => handleCardClick('/elections/register-voter')}
              className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors duration-300"
            >
              Register as Voter
            </button>
            <button
              onClick={() => handleCardClick('/elections/register-candidate')}
              className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors duration-300"
            >
              Register as Candidate
            </button>
            {/* Admin Button */}
            {isAdmin && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors duration-300"
              >
                Upload Election Posts
              </button>
            )}
          </div>
        </div>

        {/* Admin Form */}
        {isAdmin && showForm && (
          <div className="mb-12 p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-6">Add Election Post</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
                <input
                  type="text"
                  name="title"
                  value={newPost.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
                <textarea
                  name="description"
                  value={newPost.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Election Date:</label>
                <input
                  type="date"
                  name="electionDate"
                  value={newPost.electionDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors duration-300"
              >
                Add Post
              </button>
            </form>
          </div>
        )}

        {/* Election Posts Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-center mb-6">Election Posts:</h2>
          <div className="overflow-x-auto whitespace-nowrap pb-4 scrollbar-hide">
            <div className="inline-flex space-x-6">
              {electionData.electionPosts.map((post, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  className="inline-block w-96 bg-white rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
                  onClick={() => handleCardClick(`/elections/${post.title.toLowerCase()}`)}
                >
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-center mb-4">{post.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{post.description}</p>
                    <p className="text-gray-500 text-xs">Election Date: {post.electionDate}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Election Nominees Section */}
        <div>
          <h2 className="text-2xl font-semibold text-center mb-6">Live Election Nominees:</h2>
          <div className="overflow-x-auto whitespace-nowrap pb-4 scrollbar-hide">
            <div className="inline-flex space-x-6">
              {electionData.liveNominees.map((nominee, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  className="inline-block w-96 bg-white rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
                  //onClick={() => handleCardClick(`/elections/nominee/${nominee.name}`)} // Navigate to ElectionNominee
                >
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-4">{nominee.name}</h3>
                    <p className="text-gray-600">Status: {nominee.status}</p>
                    <p className="text-gray-600">Post: {nominee.post}</p>
                    {/* Vote Now Button inside each card */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click event from firing
                        handleCardClick(`/elections/nominee/${nominee.name}`);
                      }}
                      className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full w-full hover:bg-red-700 transition-colors duration-300"
                    >
                      Vote Now
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ElectionHome;

// Add custom CSS to hide the default scrollbar and style the horizontal scroller
const styles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
`;

// Inject the styles into the document head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);