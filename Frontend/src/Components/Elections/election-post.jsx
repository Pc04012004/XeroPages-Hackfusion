import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import NavBar from '../Homepage/navbar';
import Footer from '../Homepage/footer';

function ElectionPost() {
  const { postTitle } = useParams();
  const navigate = useNavigate();
  const [electionPost, setElectionPost] = useState(null);
  const [p_id, setp_id] = useState(null); // State to store the post ID
  const [totalVoters, setTotalVoters] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [approvedCandidates, setApprovedCandidates] = useState([]);
  const [unapprovedCandidates, setUnapprovedCandidates] = useState([]);
  const [userRole, setUserRole] = useState(null);

  // Fetch user role from local storage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role) {
      setUserRole(user.role);
    }
  }, []);

  // Fetch election posts from the API
  useEffect(() => {
    const fetchElectionPosts = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          throw new Error('No access token found. Please log in.');
        }

        const response = await axios.get('http://127.0.0.1:8000/election/electionposts/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Set the post ID
        setp_id(response.data[0].id);

        const filteredPost = response.data.find(post => post.position === postTitle);
        if (!filteredPost) {
          throw new Error('Election post not found.');
        }

        setElectionPost(filteredPost);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchElectionPosts();
  }, [postTitle]);

  // Fetch voters from the API and calculate total voters for the post
  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          throw new Error('No access token found. Please log in.');
        }

        const response = await axios.get('http://127.0.0.1:8000/election/voterRegister', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (electionPost) {
          const filteredVoters = response.data.filter(voter => voter.post === electionPost.id);
          setTotalVoters(filteredVoters.length);
        }
      } catch (err) {
        console.error('Error fetching voters:', err);
      }
    };

    if (electionPost) {
      fetchVoters();
    }
  }, [electionPost]);

  // Fetch candidates approved by the dean
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        let response;
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          throw new Error('No access token found. Please log in.');
        }

        if (userRole !== 'student') {
          response = await axios.get(`http://127.0.0.1:8000/election/candidates/${userRole}-approval/0/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
        } else {
          response = await axios.get(`http://127.0.0.1:8000/election/candidates/approved`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const transformedData = response.data.map((candidate) => {
            const meets_eligibility = candidate.cgpa >= 7.5;

            return {
              id: candidate.id,
              meets_eligibility,
              name: candidate.name,
              registration_number: candidate.registration_number,
              department: candidate.department,
              year: candidate.year,
              is_cr_or_sic_member: candidate.is_cr_or_sic_member,
              attendance_current_semester: candidate.attendance_current_semester,
              attendance_previous_year: candidate.attendance_previous_year,
              cgpa: candidate.cgpa,
              no_backlogs: candidate.no_backlogs,
              no_disciplinary_actions: candidate.no_disciplinary_actions,
              iut_participation: candidate.iut_participation,
              sports_captain_or_coordinator: candidate.sports_captain_or_coordinator,
              is_hostel_resident: candidate.is_hostel_resident,
              proof_document: candidate.proof_document,
              manifesto: candidate.manifesto,
              dean_approved: candidate.dean_approved,
              director_approved: candidate.director_approved,
              date_applied: candidate.date_applied,
              user: candidate.user.id,
              position_applied: candidate.position_applied.id,
            };
          });

          response.data = transformedData;
        }

        if (electionPost) {
          const filteredCandidates = response.data.filter(
            candidate => candidate.position_applied === electionPost.id
          );

          const approved = filteredCandidates.filter(
            candidate => candidate.dean_approved && candidate.director_approved
          );
          const unapproved = filteredCandidates.filter(
            candidate => !candidate.dean_approved || !candidate.director_approved
          );

          setCandidates(filteredCandidates);
          setApprovedCandidates(approved);
          setUnapprovedCandidates(unapproved);
        }
      } catch (err) {
        console.error('Error fetching candidates:', err);
      }
    };

    if (electionPost && userRole) {
      fetchCandidates();
    }
  }, [electionPost, userRole]);

  // Handle approve candidate (for dean role)
  const handleApprove = async (candidateId, userRole) => {
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        throw new Error('No access token found. Please log in.');
      }

      const response = await axios.put(
        `http://127.0.0.1:8000/election/candidates/${userRole}-approval/${candidateId}/`,
        { dean_approved: true },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        alert('Candidate approved successfully!');
        const updatedCandidates = candidates.map(candidate =>
          candidate.id === candidateId ? { ...candidate, dean_approved: true } : candidate
        );
        setCandidates(updatedCandidates);
      }
    } catch (err) {
      console.error('Error approving candidate:', err);
    }
  };

  // Handle vote (for student role)
  const handleVote = async (candidateId, postId) => {
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        throw new Error('No access token found. Please log in.');
      }
      console.log(candidateId)
      console.log(postId)

      const response = await axios.post(
        'http://127.0.0.1:8000/election/cast_vote/',
        { candidate_id: candidateId, post_id: postId }, // Pass both candidate_id and post_id
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
      alert('You have already voted for this Post');
    }
  };

  // Animation variants for sliding effect
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return <div className="text-center mt-8">Loading election post...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">Error: {error}</div>;
  }

  if (!electionPost) {
    return <div className="text-center mt-8">Election post not found.</div>;
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
            <p className="text-3xl font-bold text-blue-600">{totalVoters}</p>
          </motion.div>

          {/* Approved Candidates Section */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-lg p-6 mb-8"
          >
            <h2 className="text-2xl font-semibold mb-6">Approved Candidates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {approvedCandidates.map((candidate) => (
                <motion.div
                  key={candidate.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                  className="bg-gray-50 rounded-lg shadow-md p-4"
                >
                  <h3 className="text-xl font-bold mb-2">{candidate.name}</h3>
                  <p className="text-gray-600">Registration Number: {candidate.registration_number}</p>
                  <p className="text-gray-600">Department: {candidate.department}</p>
                  <p className="text-gray-600">Year: {candidate.year}</p>
                  <p className="text-gray-600">CGPA: {candidate.cgpa}</p>
                  {userRole === 'student' && (
                    <button
                      onClick={() => handleVote(candidate.id, p_id)} // Pass candidate.id and p_id
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 mt-4"
                    >
                      Vote Now
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Unapproved Candidates Section */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg shadow-lg p-6 mb-8"
          >
            <h2 className="text-2xl font-semibold mb-6">Pending Approval Candidates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {unapprovedCandidates.map((candidate) => (
                <motion.div
                  key={candidate.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                  className="bg-gray-50 rounded-lg shadow-md p-4"
                >
                  <h3 className="text-xl font-bold mb-2">{candidate.name}</h3>
                  <p className="text-gray-600">Registration Number: {candidate.registration_number}</p>
                  <p className="text-gray-600">Department: {candidate.department}</p>
                  <p className="text-gray-600">Year: {candidate.year}</p>
                  <p className="text-gray-600">CGPA: {candidate.cgpa}</p>

                  {/* Additional Details */}
                  <div className="mt-4 overflow-y-auto max-h-48">
                    <p className="text-gray-600">
                      <span className="font-semibold">No Backlogs:</span> {candidate.no_backlogs ? 'Yes' : 'No'}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">No Disciplinary Actions:</span> {candidate.no_disciplinary_actions ? 'Yes' : 'No'}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Sports Captain/Coordinator:</span> {candidate.sports_captain_or_coordinator ? 'Yes' : 'No'}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Hostel Resident:</span> {candidate.is_hostel_resident ? 'Yes' : 'No'}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Manifesto:</span> {candidate.manifesto}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Dean Approved:</span> {candidate.dean_approved ? 'Yes' : 'No'}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Director Approved:</span> {candidate.director_approved ? 'Yes' : 'No'}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Date Applied:</span> {new Date(candidate.date_applied).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Approve Button */}
                  {(userRole === 'dean_student' || userRole === 'director') && (
                    <button
                      onClick={() => handleApprove(candidate.id, userRole)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300 mt-4"
                    >
                      Approve Candidate
                    </button>
                  )}
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