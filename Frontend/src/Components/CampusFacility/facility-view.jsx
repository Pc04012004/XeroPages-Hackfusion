import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../Homepage/navbar";
import Footer from "../Homepage/footer";

function FacilityView() {
  const [facilities, setFacilities] = useState([]); // State to store facilities or pending approvals
  const [bookingHistory, setBookingHistory] = useState([]); // State to store booking history for students
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false); // State to control booking modal
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false); // State to control reason modal
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false); // State to control availability modal
  const [selectedFacility, setSelectedFacility] = useState(null); // State to store the selected facility for booking
  const [selectedReason, setSelectedReason] = useState(""); // State to store the selected reason for modal
  const [availabilityData, setAvailabilityData] = useState(null); // State to store availability data
  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    reason: "",
  }); // State to store form data
  const [userRole, setUserRole] = useState(""); // State to store user role

  // Fetch user role and data based on role
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("access_token"); // Get access token from localStorage
        if (!accessToken) {
          throw new Error("No access token found. Please log in.");
        }

        const user = JSON.parse(localStorage.getItem("user")); // Get user data from localStorage
        const role = user ? user.role : null; // Extract user role
        setUserRole(role); // Set user role

        if (role === "student") {
          // Fetch facilities for students
          const facilitiesResponse = await axios.get(
            "http://127.0.0.1:8000/campusfacility/facilities/",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          setFacilities(facilitiesResponse.data); // Update state with fetched facilities

          // Fetch booking history for students
          const bookingHistoryResponse = await axios.get(
            "http://127.0.0.1:8000/campusfacility/booking-history/",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          setBookingHistory(bookingHistoryResponse.data.results); // Update state with fetched booking history
        } else if (role === "hod" || role === "sport_head") {
          // Fetch pending approvals for HOD or Sport Head
          const response = await axios.get(
            "http://127.0.0.1:8000/campusfacility/pending-approvals/",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          setFacilities(response.data); // Update state with fetched pending approvals
        }

        setLoading(false); // Set loading to false
      } catch (err) {
        setError(err.message); // Set error message
        setLoading(false); // Set loading to false
      }
    };

    fetchData(); // Call the function to fetch data
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle booking form submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const accessToken = localStorage.getItem("access_token"); // Get access token from localStorage
      if (!accessToken) {
        throw new Error("No access token found. Please log in.");
      }

      const user = JSON.parse(localStorage.getItem("user")); // Get user data from localStorage
      const studentId = user ? user.user_id : null; // Extract student ID

      if (!studentId) {
        throw new Error("Student ID not found. Please log in again.");
      }

      // Prepare the payload
      const payload = {
        ...formData,
        student: studentId,
        facility_id: selectedFacility.id, // Facility ID from the selected facility
      };

      // Send the booking request to the API
      const response = await axios.post(
        "http://127.0.0.1:8000/campusfacility/book-facility/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert("Facility booked successfully!"); // Show success message
        setIsBookingModalOpen(false); // Close the modal
        setFormData({ date: "", start_time: "", end_time: "", reason: "" }); // Reset form data
        window.location.reload(); // Refresh the page to reflect the updated status
      }
    } catch (err) {
      setError("Failed to book facility. Please try again."); // Show error message
      console.error("Error booking facility:", err); // Log the error for debugging
    }
  };

  // Handle approve/reject actions
  const handleApproveReject = async (bookingId, action) => {
    try {
      const accessToken = localStorage.getItem("access_token"); // Get access token from localStorage
      if (!accessToken) {
        throw new Error("No access token found. Please log in.");
      }

      // Send the POST request to approve/reject the booking
      const response = await axios.post(
        `http://127.0.0.1:8000/campusfacility/approve-reject-booking/${bookingId}/`,
        { action: action }, // Pass the action in the request body
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert(`Booking ${action}ed successfully!`); // Show success message
        window.location.reload(); // Refresh the page to reflect the updated status
      }
    } catch (err) {
      setError(`Failed to ${action} booking. Please try again.`); // Show error message
      console.error(`Error ${action}ing booking:`, err); // Log the error for debugging
    }
  };

  // Open the booking modal and set the selected facility
  const openBookingModal = (facility) => {
    setSelectedFacility(facility); // Set the selected facility
    setIsBookingModalOpen(true); // Open the modal
  };

  // Close the booking modal
  const closeBookingModal = () => {
    setIsBookingModalOpen(false); // Close the modal
    setSelectedFacility(null); // Clear the selected facility
  };

  // Open the reason modal and set the selected reason
  const openReasonModal = (reason) => {
    setSelectedReason(reason); // Set the selected reason
    setIsReasonModalOpen(true); // Open the modal
  };

  // Close the reason modal
  const closeReasonModal = () => {
    setIsReasonModalOpen(false); // Close the modal
    setSelectedReason(""); // Clear the selected reason
  };

  // Open the availability modal and set the selected facility
  const openAvailabilityModal = (facility) => {
    setSelectedFacility(facility); // Set the selected facility
    setIsAvailabilityModalOpen(true); // Open the modal
  };

  // Close the availability modal
  const closeAvailabilityModal = () => {
    setIsAvailabilityModalOpen(false); // Close the modal
    setAvailabilityData(null); // Clear the availability data
  };

  // Handle checking availability
  const handleCheckAvailability = async () => {
    try {
      const accessToken = localStorage.getItem("access_token"); // Get access token from localStorage
      if (!accessToken) {
        throw new Error("No access token found. Please log in.");
      }

      if (!formData.date) {
        throw new Error("Please select a date.");
      }

      // Fetch availability data from the API
      const response = await axios.get(
        `http://127.0.0.1:8000/campusfacility/facilities/${selectedFacility.id}/availability/${formData.date}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setAvailabilityData(response.data); // Update state with fetched availability data
    } catch (err) {
      setError("Failed to fetch availability data. Please try again."); // Show error message
      console.error("Error fetching availability data:", err); // Log the error for debugging
    }
  };

  return (
    <>
      <NavBar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">
          {userRole === "student" ? "Campus Facilities" : "Pending Approvals"}
        </h1>

        {/* Display facilities or pending approvals */}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : userRole === "student" ? (
          // Display facilities and booking history for students
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {facilities.map((facility) => (
                <div
                  key={facility.id}
                  className="bg-white p-6 rounded-lg shadow-lg"
                  onClick={() => openAvailabilityModal(facility)}
                >
                  <h2 className="text-xl font-semibold mb-2">{facility.name}</h2>
                  <p className="text-gray-700 mb-4">
                    Status:{" "}
                    <span
                      className={`font-semibold ${
                        facility.availability_status
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {facility.availability_status ? "Available" : "Booked"}
                    </span>
                  </p>
                  <button
                    onClick={() => openBookingModal(facility)}
                    className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>

            {/* Booking History Table */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Booking History</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b text-left">Facility Name</th>
                      <th className="py-2 px-4 border-b text-left">Start Date</th>
                      <th className="py-2 px-4 border-b text-left">Start Time</th>
                      <th className="py-2 px-4 border-b text-left">End Time</th>
                      <th className="py-2 px-4 border-b text-left">Reason</th>
                      <th className="py-2 px-4 border-b text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingHistory.map((booking) => (
                      <tr key={booking.id}>
                        <td className="py-2 px-4 border-b">{booking.facility_name}</td>
                        <td className="py-2 px-4 border-b">{booking.start_date}</td>
                        <td className="py-2 px-4 border-b">{booking.start_time}</td>
                        <td className="py-2 px-4 border-b">{booking.end_time}</td>
                        <td className="py-2 px-4 border-b">{booking.reason}</td>
                        <td className="py-2 px-4 border-b">{booking.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          // Display pending approvals for HOD or Sport Head
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Facility Name</th>
                  <th className="py-2 px-4 border-b text-left">Date</th>
                  <th className="py-2 px-4 border-b text-left">Start Time</th>
                  <th className="py-2 px-4 border-b text-left">End Time</th>
                  <th className="py-2 px-4 border-b text-left">Reason</th>
                  <th className="py-2 px-4 border-b text-left">Status</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {facilities.map((booking) => (
                  <tr key={booking.id}>
                    <td className="py-2 px-4 border-b">{booking.facility_name}</td>
                    <td className="py-2 px-4 border-b">{booking.date}</td>
                    <td className="py-2 px-4 border-b">{booking.start_time}</td>
                    <td className="py-2 px-4 border-b">{booking.end_time}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => openReasonModal(booking.reason)}
                        className="text-blue-600 hover:underline"
                      >
                        View Reason
                      </button>
                    </td>
                    <td className="py-2 px-4 border-b">{booking.status}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => handleApproveReject(booking.id, "approve")}
                        className="bg-green-600 text-white p-1 rounded-md hover:bg-green-700 mr-2"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleApproveReject(booking.id, "reject")}
                        className="bg-red-600 text-white p-1 rounded-md hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">
              Book Facility: {selectedFacility?.name}
            </h2>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                <p>Date</p>
                From
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
                To
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Time
                </label>
                <input
                  type="time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Time
                </label>
                <input
                  type="time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Reason
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  rows="3"
                  required
                ></textarea>
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeBookingModal}
                  className="bg-gray-600 text-white p-2 rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reason Modal */}
      {isReasonModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Reason</h2>
            <p className="text-gray-700">{selectedReason}</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeReasonModal}
                className="bg-gray-600 text-white p-2 rounded-md hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Availability Modal */}
      {isAvailabilityModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">
              Check Availability: {selectedFacility?.name}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <button
                onClick={handleCheckAvailability}
                className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
              >
                Check Availability
              </button>
              {availabilityData && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Booked Slots</h3>
                  {availabilityData.booked_slots.length > 0 ? (
                    <table className="min-w-full bg-white border border-gray-300">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 border-b text-left">Start Time</th>
                          <th className="py-2 px-4 border-b text-left">End Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {availabilityData.booked_slots.map((slot, index) => (
                          <tr key={index}>
                            <td className="py-2 px-4 border-b">{slot.start_time}</td>
                            <td className="py-2 px-4 border-b">{slot.end_time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-gray-700">No booked slots for this date.</p>
                  )}
                </div>
              )}
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <div className="flex justify-end mt-4">
                <button
                  onClick={closeAvailabilityModal}
                  className="bg-gray-600 text-white p-2 rounded-md hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default FacilityView;