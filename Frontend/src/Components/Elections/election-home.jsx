import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import NavBar from '../Homepage/navbar';
import Footer from '../Homepage/footer';

function ElectionHome() {
  const navigate = useNavigate();
  const [electionPosts, setElectionPosts] = useState([]);
  const [liveNominees, setLiveNominees] = useState([]);
  const [isAdmin, setIsAdmin] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    electionDate: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch election posts and live nominees from the API
  useEffect(() => {
    const fetchElectionData = async () => {
      try {
        const token = localStorage.getItem('access_token');

        if (!token) {
          throw new Error('Access token not found. Please log in again.');
        }

        // Fetch election posts
        const postsResponse = await axios.get('https://xeropages.onrender.com/election/electionposts/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const posts = postsResponse.data.map((post) => ({
          title: post.position,
          description: post.description,
          electionDate: post.voting_day.split('T')[0],
        }));
        setElectionPosts(posts);

        // Fetch approved candidates (live nominees)
        const nomineesResponse = await axios.get('https://xeropages.onrender.com/election/candidates/approved/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const nominees = nomineesResponse.data.map((nominee) => ({
          id: nominee.id,
          name: nominee.name,
          status: nominee.dean_approved && nominee.director_approved ? 'Approved' : 'Pending',
          post: nominee.position_applied.position,
        }));
        setLiveNominees(nominees);

        setLoading(false);
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Unauthorized. Please log in again.');
          navigate('/login');
        } else {
          setError('Failed to fetch election data.');
          console.error(err);
        }
        setLoading(false);
      }
    };

    fetchElectionData();
  }, [navigate]);

  const handleBtnClick = async (candidateId,post_id) => {
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        throw new Error('No access token found. Please log in.');
      }

      const response = await axios.post(
        'https://xeropages.onrender.com/election/cast_vote/',
        { candidate_id: candidateId ,post_id:post_id},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert('Voted for Candidate');
        navigate('/elections');
      } else if (response.status === 403) {
        alert(response.data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('You have already voted for this post.');
    }
  };

  function handleCardClick(path) {
    navigate(path);
    return;
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedPosts = [...electionPosts, newPost];
    setElectionPosts(updatedPosts);
    setNewPost({ title: '', description: '', electionDate: '' });
    setShowForm(false);
  };

  // Animation variants for sliding effect
  const cardVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-600">{error}</div>;
  }

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
              {electionPosts.map((post, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  className="inline-block w-96 bg-white rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
                  onClick={() => handleCardClick(`/elections/${post.title}`)}
                >
                  <div className="p-6 h-64 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-center mb-4">{post.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 overflow-y-auto max-h-20 whitespace-normal">
                        {post.description}
                      </p>
                    </div>
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
              {liveNominees.map((nominee, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  className="inline-block w-96 bg-white rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-6 h-64 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-4">{nominee.name}</h3>
                      <p className="text-gray-600">Status: {nominee.status}</p>
                      <p className="text-gray-600">Post: {nominee.post}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBtnClick(nominee.id, nominee.position_applied.id);
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
        <h2 className="text-2xl font-semibold text-center mb-6">Election Results:</h2>
        <button
                      onClick={(e) => {navigate("/elections/results")}}
                      className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full w-full hover:bg-red-700 transition-colors duration-300"
                    > Show Results</button>
        
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