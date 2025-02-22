import React, { useState, useEffect } from "react";
import axios from "axios";
import { PlusCircle } from "lucide-react"; // Icon for Create Report
import NavBar from "../Homepage/navbar";
import Footer from "../Homepage/footer";

function DoctorDashboard() {
  const [reports, setReports] = useState([]); // State to store health reports
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false); // State to control report modal visibility
  const [selectedNotes, setSelectedNotes] = useState(null); // State to store selected doctor notes
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false); // State to control notes modal visibility
  const [formData, setFormData] = useState({
    department: "",
    year: "",
    section: "",
    status: "",
    doctor_notes: "",
  }); // State to store form data

  // Fetch health reports from the API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const accessToken = localStorage.getItem("access_token"); // Get access token from localStorage
        if (!accessToken) {
          throw new Error("No access token found. Please log in.");
        }

        const response = await axios.get("http://127.0.0.1:8000/leave/health-records/", {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include access token in headers
          },
        });

        setReports(response.data); // Update state with fetched reports
        setLoading(false); // Set loading to false
      } catch (err) {
        setError(err.message); // Set error message
        setLoading(false); // Set loading to false
      }
    };

    fetchReports(); // Call the function to fetch reports
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // Update form data
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const accessToken = localStorage.getItem("access_token"); // Get access token from localStorage
      if (!accessToken) {
        throw new Error("No access token found. Please log in.");
      }

      const response = await axios.post(
        "http://127.0.0.1:8000/leave/health-records/",
        formData, // Form data as payload
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include access token in headers
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert("Report created successfully!"); // Show success message
        setIsReportModalOpen(false); // Close the modal
        setFormData({ department: "", year: "", section: "", status_text: "", doctor_notes: "" }); // Reset form data
        window.location.reload(); // Refresh the data
      }
    } catch (err) {
      console.error("Error submitting report:", err); // Log the error
      alert("Failed to submit report. Please try again."); // Show error message
    }
  };

  const handleViewNotes = (notes) => {
    setSelectedNotes(notes); // Set the selected doctor notes
    setIsNotesModalOpen(true); // Open the notes modal
  };

  const closeNotesModal = () => {
    setIsNotesModalOpen(false); // Close the notes modal
    setSelectedNotes(null); // Clear the selected notes
  };

  return (
    <>
      <NavBar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Doctor Dashboard</h1>

        {/* Create Report Section */}
        <div
          className="bg-gray-200 text-gray-900 text-lg font-semibold w-52 h-20 flex flex-col items-center justify-center rounded-lg shadow-lg cursor-pointer space-y-1 hover:bg-gray-300 transition duration-200 mb-8"
          onClick={() => setIsReportModalOpen(true)}
        >
          <PlusCircle size={28} />
          <span>Create Report</span>
        </div>

        {/* Health Reports Table */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Health Reports</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            {loading ? (
              <p className="text-center text-gray-500">Loading health reports...</p>
            ) : error ? (
              <p className="text-center text-red-600">{error}</p>
            ) : (
              <table className="w-full text-sm text-gray-700">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 font-medium text-left">Department</th>
                    <th className="py-3 font-medium text-left">Year</th>
                    <th className="py-3 font-medium text-left">Section</th>
                    <th className="py-3 font-medium text-left">Status</th>
                    <th className="py-3 font-medium text-left">Doctor Notes</th>
                    <th className="py-3 font-medium text-left">Date Reported</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.length > 0 ? (
                    reports.map((report) => (
                      <tr key={report.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="py-3 text-left">{report.department}</td>
                        <td className="py-3 text-left">{report.year}</td>
                        <td className="py-3 text-left">{report.section}</td>
                        <td className="py-3 text-left">{report.status}</td>
                        <td className="py-3 text-left">
                          <button
                            onClick={() => handleViewNotes(report.doctor_notes)}
                            className="text-blue-600 hover:underline"
                          >
                            View Notes
                          </button>
                        </td>
                        <td className="py-3 text-left">{new Date(report.date_reported).toLocaleDateString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-3 text-center text-gray-500">
                        No health reports found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Creating Report */}
      {isReportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-xl font-bold mb-4">Create Health Report</h3>
            <form onSubmit={handleSubmitReport}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Department:</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Year:</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Section:</label>
                <input
                  type="text"
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Status:</label>
                <input
                  type="text"
                  name="status_text"
                  value={formData.status_text}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Doctor Notes:</label>
                <textarea
                  name="doctor_notes"
                  value={formData.doctor_notes}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
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

      {/* Modal for Displaying Doctor Notes */}
      {isNotesModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-xl font-bold mb-4">Doctor Notes</h3>
            <p className="text-gray-700">{selectedNotes}</p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeNotesModal}
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

export default DoctorDashboard;