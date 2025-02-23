import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaExclamationTriangle } from "react-icons/fa"; // Icon for the card
import NavBar from "../Homepage/navbar"; // Replace with your Navbar component
import Footer from "../Homepage/footer";

function CheatingRecordSystem() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false); // State for action modal
  const [formData, setFormData] = useState({
    registration_no: "",
    exam_name: "",
    proof: null,
    date_reported: new Date().toISOString(), // Default to current date
  });
  const [actionData, setActionData] = useState({
    cheating_record_id: null, // Store the cheating record ID
    action: "", // Store the action input
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [pendingRecords, setPendingRecords] = useState([]); // State to store pending cheating records

  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user ? user.role : null;

  // Fetch pending cheating records on component mount
  useEffect(() => {
    const fetchPendingRecords = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setError("Authentication token is missing. Please log in again.");
          return;
        }

        const response = await axios.get(
          "http://127.0.0.1:8000/Complaints/cheating-record-list/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setPendingRecords(response.data); // Store the fetched data
        } else {
          setError("Failed to fetch pending records.");
        }
      } catch (err) {
        setError("An error occurred while fetching pending records.");
        console.error(err); // Log the error for debugging
      }
    };

    fetchPendingRecords();
  }, []);

  // Open modal for reporting cheating
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Close modal for reporting cheating
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      registration_no: "",
      exam_name: "",
      proof: null,
      date_reported: new Date().toISOString(),
    });
    setError(null);
    setSuccess(null);
  };

  // Open modal for adding action
  const openActionModal = (cheatingRecordId) => {
    setIsActionModalOpen(true);
    setActionData({
      cheating_record_id: cheatingRecordId,
      action: "", // Reset action input
    });
  };

  // Close modal for adding action
  const closeActionModal = () => {
    setIsActionModalOpen(false);
    setActionData({
      cheating_record_id: null,
      action: "",
    });
  };

  // Handle form input changes for reporting cheating
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file input changes for reporting cheating
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        proof: file,
      });
    }
  };

  // Handle form submission for reporting cheating
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Authentication token is missing. Please log in again.");
        return;
      }

      // Create FormData object
      const formDataToSend = new FormData();
      formDataToSend.append("student", formData.registration_no);
      formDataToSend.append("exam_name", formData.exam_name);
      formDataToSend.append("action", "Not Done Yet");
      formDataToSend.append("proof", formData.proof);
      formDataToSend.append("date_reported", formData.date_reported);

      // Send the request to the backend
      const response = await axios.post(
        "http://127.0.0.1:8000/Complaints/add-cheating-record/", // Replace with your API endpoint
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        setSuccess("Report submitted successfully!");
        alert("Report submitted successfully!");
        window.location.reload(); // Reload the window
      } else {
        setError("Failed to submit report. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while submitting the report.");
      console.error(err); // Log the error for debugging
    }
  };

  // Handle form submission for adding action
  const handleActionSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Authentication token is missing. Please log in again.");
        return;
      }

      // Send the PATCH request to the backend
      const response = await axios.patch(
        `http://127.0.0.1:8000/Complaints/cheating-records/${actionData.cheating_record_id}/add-action/`,
        { action: actionData.action }, // Send the action data
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccess("Action submitted successfully!");
        alert("Action submitted successfully!");
        window.location.reload(); // Reload the window
      } else {
        setError("Failed to submit action. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while submitting the action.");
      console.error(err); // Log the error for debugging
    }
  };

  // Only show the component if the user role is hod, faculty, admin, or student
  if (!["hod", "faculty", "admin", "student"].includes(userRole)) {
    return null;
  }

  return (
    <div>
      {/* Navbar */}
      <NavBar />

      {/* Cheating Record Card (Only for hod, faculty, and admin) */}
      {["hod", "faculty", "admin"].includes(userRole) && (
        <div
          className="cursor-pointer p-5 border border-gray-300 rounded-lg text-center max-w-xs mx-auto my-12 shadow-md hover:shadow-lg transition-shadow"
          onClick={openModal}
        >
          <FaExclamationTriangle className="mx-auto mb-3 text-4xl text-red-500" />
          <h3 className="text-xl font-semibold">Report Cheating</h3>
          <p className="text-gray-600">Click here to report a cheating incident.</p>
        </div>
      )}

      {/* Cheating Record Form Modal (Only for hod, faculty, and admin) */}
      {["hod", "faculty", "admin"].includes(userRole) && isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-md">
            <h2 className="text-2xl font-bold mb-4">Report Cheating</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Registration Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Registration Number</label>
                <input
                  type="text"
                  name="registration_no"
                  value={formData.registration_no}
                  onChange={handleChange}
                  className="mt-1 block w-full p-1.5 border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Exam Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Exam Name</label>
                <input
                  type="text"
                  name="exam_name"
                  value={formData.exam_name}
                  onChange={handleChange}
                  className="mt-1 block w-full p-1.5 border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Proof Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Proof Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1 block w-full p-1.5 border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Date Reported */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Date Reported</label>
                <input
                  type="datetime-local"
                  name="date_reported"
                  value={formData.date_reported}
                  onChange={handleChange}
                  className="mt-1 block w-full p-1.5 border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Error Message */}
              {error && <div className="text-red-600 text-sm">{error}</div>}

              {/* Success Message */}
              {success && <div className="text-green-600 text-sm">{success}</div>}

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full bg-red-600 text-white p-1.5 rounded-md hover:bg-red-700"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pending Cheating Records Table */}
      <div className="container mx-auto px-4 my-12">
        <h2 className="text-2xl font-bold mb-4">Cheating Records</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">ID</th>
                <th className="py-2 px-4 border">Student</th>
                <th className="py-2 px-4 border">Exam Name</th>
                <th className="py-2 px-4 border">Action</th>
                <th className="py-2 px-4 border">Proof</th>
                <th className="py-2 px-4 border">Date Reported</th>
                {["hod", "faculty", "admin"].includes(userRole) && (
                  <th className="py-2 px-4 border">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {pendingRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{record.id}</td>
                  <td className="py-2 px-4 border">{record.student}</td>
                  <td className="py-2 px-4 border">{record.exam_name}</td>
                  <td className="py-2 px-4 border">{record.action}</td>
                  <td className="py-2 px-4 border">
                    {record.proof ? (
                      <a href={record.proof} target="_blank" rel="noopener noreferrer">
                        View Proof
                      </a>
                    ) : (
                      "No Proof"
                    )}
                  </td>
                  <td className="py-2 px-4 border">{new Date(record.date_reported).toLocaleString()}</td>
                  {["hod", "faculty", "admin"].includes(userRole) && (
                    <td className="py-2 px-4 border">
                      <button
                        onClick={() => openActionModal(record.id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        Action
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Modal (Only for hod, faculty, and admin) */}
      {["hod", "faculty", "admin"].includes(userRole) && isActionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add Action</h2>
            <form onSubmit={handleActionSubmit} className="space-y-4">
              {/* Action Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Action</label>
                <input
                  type="text"
                  name="action"
                  value={actionData.action}
                  onChange={(e) => setActionData({ ...actionData, action: e.target.value })}
                  className="mt-1 block w-full p-1.5 border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Error Message */}
              {error && <div className="text-red-600 text-sm">{error}</div>}

              {/* Success Message */}
              {success && <div className="text-green-600 text-sm">{success}</div>}

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-1.5 rounded-md hover:bg-blue-700"
                >
                  Submit Action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default CheatingRecordSystem;