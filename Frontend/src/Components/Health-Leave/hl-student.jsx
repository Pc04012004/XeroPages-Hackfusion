import React, { useState, useEffect } from "react";
import { CalendarPlus, History, HeartPulse } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import NavBar from "../Homepage/navbar";
import Footer from "../Homepage/footer";

function StudentDashboard() {
  const [leaveRequests, setLeaveRequests] = useState([]); // State to store leave requests
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [selectedReason, setSelectedReason] = useState(null); // State to store the selected reason
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [isLeaveFormOpen, setIsLeaveFormOpen] = useState(false); // State to control leave form modal
  const [formData, setFormData] = useState({
    reason: "",
    departure_time: "",
    return_time: "",
  }); // State to store form data

  const navigate = useNavigate(); // Initialize the navigate function

  // Fetch leave requests from the API
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const accessToken = localStorage.getItem("access_token"); // Get access token from localStorage
        if (!accessToken) {
          throw new Error("No access token found. Please log in.");
        }

        const response = await axios.get("http://127.0.0.1:8000/leave/leave-requests/", {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include access token in headers
          },
        });

        // Transform the API response to match the table structure
        const transformedData = response.data.map((request) => ({
          id: request.id,
          requestId: `LR${request.id.toString().padStart(4, "0")}`, // Generate a request ID
          reason: request.reason,
          from: new Date(request.departure_time).toLocaleDateString(), // Format departure time
          to: new Date(request.return_time).toLocaleDateString(), // Format return time
          hodApproval: request.hod_approval ? "Approved" : "Pending",
          wardenApproval: request.warden_approval ? "Approved" : "Pending",
          securityVerification: request.security_verification ? "Verified" : "Pending",
          finalStatus: request.final_status ? "Approved" : "Pending",
        }));

        setLeaveRequests(transformedData); // Update state with transformed data
        setLoading(false); // Set loading to false
      } catch (err) {
        setError(err.message); // Set error message
        setLoading(false); // Set loading to false
      }
    };

    fetchLeaveRequests(); // Call the function to fetch leave requests
  }, []);

  const handleViewReason = (reason) => {
    setSelectedReason(reason); // Set the selected reason
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedReason(null); // Clear the selected reason
  };

  const openLeaveForm = () => {
    setIsLeaveFormOpen(true); // Open the leave request form modal
  };

  const closeLeaveForm = () => {
    setIsLeaveFormOpen(false); // Close the leave request form modal
    setFormData({ reason: "", departure_time: "", return_time: "" }); // Reset form data
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // Update form data
  };

  const handleSubmitLeaveRequest = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const accessToken = localStorage.getItem("access_token"); // Get access token from localStorage
      const user = JSON.parse(localStorage.getItem("user")); // Get user data from localStorage

      if (!accessToken || !user) {
        throw new Error("No access token or user data found. Please log in.");
      }

      const payload = {
        student: user.id, // Include user ID from localStorage
        reason: formData.reason,
        departure_time: new Date(formData.departure_time).toISOString(), // Convert to ISO format
        return_time: new Date(formData.return_time).toISOString(), // Convert to ISO format
      };

      const response = await axios.post(
        "http://127.0.0.1:8000/leave/leave-requests/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include access token in headers
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert("Leave request created successfully!");
        navigate("/home/health-notifications/student"); // Navigate to the specified path
      }
    } catch (err) {
      console.error("Error submitting leave request:", err);
      alert("Failed to submit leave request. Please try again.");
    }
  };

  return (
    <>
      <NavBar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>

        {/* Quick Actions Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex space-x-6">
            {[
              { text: "Request Leave", icon: <CalendarPlus size={28} />, action: openLeaveForm },
              { text: "Leave History", icon: <History size={28} />, action: () => navigate("/home/health-notifications/student/history") }, // Navigate to history page
              { text: "Medical Records", icon: <HeartPulse size={28} />, action: () => console.log("Medical Records clicked") },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gray-200 text-gray-900 text-lg font-semibold 
                           w-52 h-20 flex flex-col items-center justify-center 
                           rounded-lg shadow-lg cursor-pointer space-y-1
                           hover:bg-gray-300 transition duration-200"
                onClick={item.action}
              >
                {item.icon}
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Leave Requests Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Leave Requests</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            {loading ? (
              <p className="text-center text-gray-500">Loading leave requests...</p>
            ) : error ? (
              <p className="text-center text-red-600">{error}</p>
            ) : (
              <table className="w-full text-sm text-gray-700 table-fixed">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 font-medium text-left w-24">Request ID</th>
                    <th className="py-3 font-medium text-left w-48">Reason</th>
                    <th className="py-3 font-medium text-left w-24">From</th>
                    <th className="py-3 font-medium text-left w-24">To</th>
                    <th className="py-3 font-medium text-left w-32">HOD Approval</th>
                    <th className="py-3 font-medium text-left w-32">Warden Approval</th>
                    <th className="py-3 font-medium text-left w-32">Security Verification</th>
                    <th className="py-3 font-medium text-left w-32">Final Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.length > 0 ? (
                    leaveRequests.map((request) => (
                      <tr key={request.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="py-3 text-left">{request.requestId}</td>
                        <td className="py-3 text-left">
                          <button
                            onClick={() => handleViewReason(request.reason)}
                            className="text-blue-600 hover:underline"
                          >
                            View Reason
                          </button>
                        </td>
                        <td className="py-3 text-left">{request.from}</td>
                        <td className="py-3 text-left">{request.to}</td>
                        <td className="py-3 text-left">
                          <span
                            className={`px-2 py-1 rounded-full text-sm ${
                              request.hodApproval === "Approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {request.hodApproval}
                          </span>
                        </td>
                        <td className="py-3 text-left">
                          <span
                            className={`px-2 py-1 rounded-full text-sm ${
                              request.wardenApproval === "Approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {request.wardenApproval}
                          </span>
                        </td>
                        <td className="py-3 text-left">
                          <span
                            className={`px-2 py-1 rounded-full text-sm ${
                              request.securityVerification === "Verified"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {request.securityVerification}
                          </span>
                        </td>
                        <td className="py-3 text-left">
                          <span
                            className={`px-2 py-1 rounded-full text-sm ${
                              request.finalStatus === "Approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {request.finalStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="py-3 text-center text-gray-500">
                        No leave requests found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Displaying Full Reason */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-xl font-bold mb-4">Reason for Leave</h3>
            <p className="text-gray-700">{selectedReason}</p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Leave Request Form */}
      {isLeaveFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-xl font-bold mb-4">Request Leave</h3>
            <form onSubmit={handleSubmitLeaveRequest}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Reason:</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Departure Time:</label>
                <input
                  type="datetime-local"
                  name="departure_time"
                  value={formData.departure_time}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Return Time:</label>
                <input
                  type="datetime-local"
                  name="return_time"
                  value={formData.return_time}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={closeLeaveForm}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-300 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default StudentDashboard;