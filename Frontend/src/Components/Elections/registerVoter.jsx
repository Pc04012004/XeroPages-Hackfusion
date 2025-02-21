import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API calls

function RegisterVoter() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user: '',
    name: '',
    department: '',
    year: '',
    registration_number: '',
    post: '', // election_post
  });

  const [electionPosts, setElectionPosts] = useState([]); // State to store election posts
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors

  // Fetch election posts from the API with authentication
  useEffect(() => {
    const fetchElectionPosts = async () => {
      try {
        const accessToken = localStorage.getItem('access_token'); // Retrieve the access token from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user.user_id;
        setFormData({ ...formData, user: userId }); // Set the user ID in form data

        if (!accessToken) {
          throw new Error('No access token found. Please log in.');
        }

        const response = await axios.get('http://127.0.0.1:8000/election/electionposts/', {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the access token in the request headers
          },
        });

        setElectionPosts(response.data); // Set the fetched election posts
        setLoading(false); // Set loading to false after data is fetched
      } catch (err) {
        setError(err.message); // Set error message if API call fails
        setLoading(false); // Set loading to false
      }
    };

    fetchElectionPosts(); // Call the function to fetch election posts
  }, []); // Empty dependency array ensures this runs only once on component mount

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        throw new Error('No access token found. Please log in.');
      }

      const response = await axios.post(
        'http://127.0.0.1:8000/election/voterRegister', // Update the API endpoint
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json', // Set the content type to JSON
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert('Voter registration successful!');
        navigate('/elections');
      } else {
        alert('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading election posts...</div>; // Show loading message
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">Error: {error}</div>; // Show error message
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Register as Voter</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Full Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Department:</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Year:</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Registration Number:</label>
            <input
              type="text"
              name="registration_number"
              value={formData.registration_number}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Election Position:</label>
            <select
              name="post"
              value={formData.post}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            >
              <option value="">Select Position</option>
              {electionPosts.map((post) => (
                <option key={post.id} value={post.id}>
                  {post.position} - {post.description}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Register as Voter
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterVoter;