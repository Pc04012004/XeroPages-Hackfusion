import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaExclamationCircle } from 'react-icons/fa'; // Icon for the card
import NavBar from '../Homepage/navbar'; // Replace with your Navbar component
import Footer from '../Homepage/footer';

const AnonymousComplaintSystem = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [text, setText] = useState('');
    const [anonymous, setAnonymous] = useState(false);
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [complaints, setComplaints] = useState([]); // State to store fetched complaints
    const [selectedComplaintText, setSelectedComplaintText] = useState(''); // State to store selected complaint text
    const [isTextModalOpen, setIsTextModalOpen] = useState(false); // State to control text modal
    const [userRole, setUserRole] = useState(''); // State to store user role

    // Fetch user role on component mount
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        const role = user.role; // Fetch role from local storage or API
        setUserRole(role);
    }, []);

    // Fetch approved complaints on component mount
    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await axios.get(
                    'http://127.0.0.1:8000/complaints/complaints/',
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        },
                    }
                );

                // Filter complaints where `approved` is true
                const approvedComplaints = response.data.filter(complaint => complaint.approved);
                setComplaints(approvedComplaints);
            } catch (err) {
                console.error('Error fetching complaints:', err);
            }
        };

        fetchComplaints();
    }, []);

    // Open complaint form modal
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Close complaint form modal
    const closeModal = () => {
        setIsModalOpen(false);
        setText('');
        setAnonymous(false);
        setImage(null);
        setVideo(null);
        setError('');
        setSuccess('');
    };

    // Open text modal
    const openTextModal = (text) => {
        setSelectedComplaintText(text);
        setIsTextModalOpen(true);
    };

    // Close text modal
    const closeTextModal = () => {
        setIsTextModalOpen(false);
        setSelectedComplaintText('');
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('text', text);
        formData.append('anonymous', anonymous ? 'true' : 'false'); // Send as string
        if (image) formData.append('image', image);
        if (video) formData.append('video', video);

        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/complaints/submit-complaint/',  
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`, // Add authentication token if required
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                setSuccess('Complaint submitted successfully!');
                alert('Complaint created successfully!');
                window.location.reload(); // Reload the window
            }
        } catch (err) {
            if (err.response) {
                setError(err.response.data.error || 'An error occurred while submitting the complaint.');
            } else {
                setError('An error occurred while submitting the complaint.');
            }
        }
    };

    // Handle "Vote for Reveal" action
    const handleVoteForReveal = async (complaintId) => {
        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/complaints/api/complaints/${complaintId}/vote/`,
                { role: userRole }, // Send user role in the request body
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                alert('Vote submitted successfully!');
                window.location.reload(); // Reload the window to reflect changes
            }
        } catch (err) {
            console.error('Error submitting vote:', err);
            alert('An error occurred while submitting the vote.');
        }
    };

    return (
        <div>
            {/* Navbar */}
            <NavBar />

            {/* Complaint Card (Only for students) */}
            {userRole === 'student' && (
                <div
                    className="cursor-pointer p-5 border border-gray-300 rounded-lg text-center max-w-xs mx-auto my-12 shadow-md hover:shadow-lg transition-shadow"
                    onClick={openModal}
                >
                    <FaExclamationCircle className="mx-auto mb-3 text-4xl text-blue-500" />
                    <h3 className="text-xl font-semibold">File a Complaint</h3>
                    <p className="text-gray-600">Click here to submit an anonymous complaint.</p>
                </div>
            )}

            {/* Complaint Form Modal (Only for students) */}
            {userRole === 'student' && isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-11/12 max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Submit a Complaint</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Complaint Text:</label>
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    rows="4"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={anonymous}
                                        onChange={(e) => setAnonymous(e.target.checked)}
                                        className="mr-2"
                                    />
                                    Submit Anonymously
                                </label>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Upload Image:</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImage(e.target.files[0])}
                                    className="w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Upload Video:</label>
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => setVideo(e.target.files[0])}
                                    className="w-full"
                                />
                            </div>
                            {error && <p className="text-red-500 mb-4">{error}</p>}
                            {success && <p className="text-green-500 mb-4">{success}</p>}
                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Approved Complaints Table */}
            <div className="container mx-auto px-4 my-12">
                <h2 className="text-2xl font-bold mb-4">Approved Complaints</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border">ID</th>
                                <th className="py-2 px-4 border">Student</th>
                                <th className="py-2 px-4 border">Anonymous</th>
                                <th className="py-2 px-4 border">Text</th>
                                <th className="py-2 px-4 border">Image</th>
                                <th className="py-2 px-4 border">Video</th>
                                <th className="py-2 px-4 border">Approved</th>
                                <th className="py-2 px-4 border">Board Approved Identity</th>
                                <th className="py-2 px-4 border">Created At</th>
                                {userRole === 'board_member' && <th className="py-2 px-4 border">Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {complaints.map((complaint) => (
                                <tr key={complaint.id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border">{complaint.id}</td>
                                    <td className="py-2 px-4 border">{complaint.student != null ? complaint.student : 'Anonymous'}</td>
                                    <td className="py-2 px-4 border">{complaint.anonymous ? 'Yes' : 'No'}</td>
                                    <td
                                        className="py-2 px-4 border text-blue-500 cursor-pointer hover:underline"
                                        onClick={() => openTextModal(complaint.text)}
                                    >
                                        {complaint.text.length > 50 ? `${complaint.text.substring(0, 50)}...` : complaint.text}
                                    </td>
                                    <td className="py-2 px-4 border">
                                        {complaint.image ? (
                                            <a href={complaint.image} target="_blank" rel="noopener noreferrer">
                                                View Image
                                            </a>
                                        ) : (
                                            'No Image'
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border">
                                        {complaint.video ? (
                                            <a href={complaint.video} target="_blank" rel="noopener noreferrer">
                                                View Video
                                            </a>
                                        ) : (
                                            'No Video'
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border">{complaint.approved ? 'Yes' : 'No'}</td>
                                    <td className="py-2 px-4 border">{complaint.board_approved_identity ? 'Yes' : 'No'}</td>
                                    <td className="py-2 px-4 border">{new Date(complaint.created_at).toLocaleString()}</td>
                                    {userRole === 'board_member' && (
                                        <td className="py-2 px-4 border">
                                            <button
                                                onClick={() => handleVoteForReveal(complaint.id)}
                                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                            >
                                                Vote for Reveal
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Text Modal */}
            {isTextModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-11/12 max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Complaint Text</h2>
                        <p className="whitespace-pre-wrap">{selectedComplaintText}</p>
                        <div className="flex justify-end mt-4">
                            <button
                                type="button"
                                onClick={closeTextModal}
                                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default AnonymousComplaintSystem;