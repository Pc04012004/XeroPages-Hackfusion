import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../Homepage/navbar";
import Footer from "../Homepage/footer";

function SecurityDashboard() {
  const [leaveRequests, setLeaveRequests] = useState([]); // State to store leave requests
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [selectedReason, setSelectedReason] = useState(null); // State to store the selected reason
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  // Fetch leave requests from the API
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const accessToken = localStorage.getItem("access_token"); // Get access token from localStorage
        if (!accessToken) {
          throw new Error("No access token found. Please log in.");
        }

        const response = await axios.get("https://xeropages.onrender.com/leave/leave-requests/pending/security/", {
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

  const handleApprove = async (requestId) => {
    try {
      const accessToken = localStorage.getItem("access_token"); // Get access token from localStorage
      if (!accessToken) {
        throw new Error("No access token found. Please log in.");
      }

      // Make a PUT request to approve the leave request
      const response = await axios.put(
        `https://xeropages.onrender.com/leave/leave-requests/${requestId}/security-verify/`,
        { action : "approve"},
         // JSON payload
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the access token in the headers
            "Content-Type": "application/json", // Set the content type to JSON
          },
        }
      );

      if (response.status === 200) {
        alert("Leave Approved"); // Show success message
        window.location.reload(); // Refresh the data
      }
    } catch (err) {
      console.error("Error approving leave request:", err); // Log the error
      alert("Failed to approve leave request. Please try again."); // Show error message
    }
  };

//   const handleReject = async (requestId) => {
//     try {
//       const accessToken = localStorage.getItem("access_token"); // Get access token from localStorage
//       if (!accessToken) {
//         throw new Error("No access token found. Please log in.");
//       }

//       // Make a PUT request to reject the leave request
//       const response = await axios.put(
//         `https://xeropages.onrender.com/leave/leave-requests/${requestId}/security-verify/`,
//           // JSON payload
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`, // Include the access token in the headers
//             "Content-Type": "application/json", // Set the content type to JSON
//           },
//         }
//       );

//       if (response.status === 200) {
//         alert("Leave Rejected"); // Show success message
//         window.location.reload(); // Refresh the data
//       }
//     } catch (err) {
//       console.error("Error rejecting leave request:", err); // Log the error
//       alert("Failed to reject leave request. Please try again."); // Show error message
//     }
//   };

  const handleViewReason = (reason) => {
    setSelectedReason(reason); // Set the selected reason
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedReason(null); // Clear the selected reason
  };

  return (
    <>
      <NavBar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Security Dashboard</h1>

        {/* Pending Leave Requests Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Pending Leave Requests</h2>
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
                    <th className="py-3 font-medium text-left w-32">Action</th>
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
                        <td className="py-3 text-left">
                          <button
                            onClick={() => handleApprove(request.id)}
                            className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors duration-300 mr-2"
                          >
                            Verify
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="py-3 text-center text-gray-500">
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

      <Footer />
    </>
  );
}

export default SecurityDashboard;