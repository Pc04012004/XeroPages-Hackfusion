import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API calls

function RegisterCandidate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    collegeEmail: '',
    registrationNumber: '',
    department: '',
    year: '',
    positionApplied: '',
    isCrOrSicMember: false,
    attendanceCurrentSemester: 0,
    attendancePreviousYear: 0,
    cgpa: 0,
    noBacklogs: true,
    noDisciplinaryActions: true,
    iutParticipation: false,
    sportsCaptainOrCoordinator: false,
    isHostelResident: false,
    proofDocument: null,
    manifesto: '', // Manifesto as text input
  });

  const [electionPosts, setElectionPosts] = useState([]); // State to store election posts
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors

  // Fetch election posts from the API with authentication
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
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileUpload = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const accessToken = localStorage.getItem('accessToken'); // Retrieve the access token from localStorage
      if (!accessToken) {
        throw new Error('No access token found. Please log in.');
      }

      const response = await fetch('/api/register-candidate', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`, // Include the access token in the request headers
        },
        body: formDataToSend,
      });

      if (response.ok) {
        alert('Candidate registration successful!');
        navigate('/');
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
        <h2 className="text-3xl font-bold text-center mb-8">Register as Candidate</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
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
            <label className="block text-gray-700 text-sm font-bold mb-2">College Email:</label>
            <input
              type="email"
              name="collegeEmail"
              value={formData.collegeEmail}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Registration Number:</label>
            <input
              type="text"
              name="registrationNumber"
              value={formData.registrationNumber}
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
            <label className="block text-gray-700 text-sm font-bold mb-2">Election Position:</label>
            <select
              name="positionApplied"
              value={formData.positionApplied}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            >
              <option value="">Select Position</option>
              {electionPosts.map((post) => (
                <option key={post.id} value={post.position}>
                  {post.position} - {post.description}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Are you a CR or SIC member?</label>
            <input
              type="checkbox"
              name="isCrOrSicMember"
              checked={formData.isCrOrSicMember}
              onChange={handleInputChange}
              className="mr-2"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Current Semester Attendance (%):</label>
            <input
              type="number"
              name="attendanceCurrentSemester"
              value={formData.attendanceCurrentSemester}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Previous Year Attendance (%):</label>
            <input
              type="number"
              name="attendancePreviousYear"
              value={formData.attendancePreviousYear}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">CGPA:</label>
            <input
              type="number"
              name="cgpa"
              value={formData.cgpa}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">No Backlogs:</label>
            <input
              type="checkbox"
              name="noBacklogs"
              checked={formData.noBacklogs}
              onChange={handleInputChange}
              className="mr-2"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">No Disciplinary Actions:</label>
            <input
              type="checkbox"
              name="noDisciplinaryActions"
              checked={formData.noDisciplinaryActions}
              onChange={handleInputChange}
              className="mr-2"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">IUT Participation:</label>
            <input
              type="checkbox"
              name="iutParticipation"
              checked={formData.iutParticipation}
              onChange={handleInputChange}
              className="mr-2"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Sports Captain or Coordinator:</label>
            <input
              type="checkbox"
              name="sportsCaptainOrCoordinator"
              checked={formData.sportsCaptainOrCoordinator}
              onChange={handleInputChange}
              className="mr-2"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Hostel Resident:</label>
            <input
              type="checkbox"
              name="isHostelResident"
              checked={formData.isHostelResident}
              onChange={handleInputChange}
              className="mr-2"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Upload Proof Document:</label>
            <input
              type="file"
              name="proofDocument"
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Manifesto:</label>
            <textarea
              name="manifesto"
              value={formData.manifesto}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              rows="5"
              placeholder="Enter your manifesto here..."
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Register as Candidate
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterCandidate;