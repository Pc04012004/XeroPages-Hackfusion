import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function StudentEditProfile() {
  const [formData, setFormData] = useState({
    user: null,
    full_name: "",
    dob: "",
    email: "",
    phone_no: "",
    section: "A", // Default to 'A'
    registration_no: "",
    gender: "Male", // Default to 'Male'
    address: "",
    course: "",
    department: "",
    year_of_study: "",
    parent_email: "",
    Parent_phone_no: "",
    hostel_status: false,
    profile_picture: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profile_picture: file });
      setImagePreview(URL.createObjectURL(file)); // Show preview
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Get the user ID from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user ? user.user_id : null;

    // Add the user ID to the form data
    const updatedFormData = { ...formData, user: userId };

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Authentication token is missing. Please log in again.");
        return;
      }

      // Create FormData object
      const formDataToSend = new FormData();
      for (const key in updatedFormData) {
        if (updatedFormData[key] !== null && updatedFormData[key] !== undefined) {
          formDataToSend.append(key, updatedFormData[key]);
        }
      }

      // Log the form data being sent
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      // Send the request to the backend
      const response = await axios.post(
        "https://xeropages.onrender.com/auth/studentProfile/",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        navigate("/home"); // Navigate on success
      } else {
        setError("Failed to register user. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while registering. Please check the details.");
      console.error(err); // Log the error for debugging
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Student Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name and DOB */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="mt-1 block w-full p-1.5 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="mt-1 block w-full p-1.5 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          {/* Email and Phone No */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full p-1.5 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phone_no"
                value={formData.phone_no}
                onChange={handleChange}
                className="mt-1 block w-full p-1.5 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          {/* Section and Registration No */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Section</label>
              <select
                name="section"
                value={formData.section}
                onChange={handleChange}
                className="mt-1 block w-full p-1.5 border border-gray-300 rounded-md"
                required
              >
                <option value="A">A</option>
                <option value="B">B</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Registration No</label>
              <input
                type="text"
                name="registration_no"
                value={formData.registration_no}
                onChange={handleChange}
                className="mt-1 block w-full p-1.5 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          {/* Gender and Hostel Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 block w-full p-1.5 border border-gray-300 rounded-md"
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Hostel Status</label>
              <input
                type="checkbox"
                name="hostel_status"
                checked={formData.hostel_status}
                onChange={handleChange}
                className="mt-1 block p-1.5 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Parent Email and Parent Phone No */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Parent Email</label>
              <input
                type="email"
                name="parent_email"
                value={formData.parent_email}
                onChange={handleChange}
                className="mt-1 block w-full p-1.5 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Parent Phone Number</label>
              <input
                type="tel"
                name="Parent_phone_no"
                value={formData.Parent_phone_no}
                onChange={handleChange}
                className="mt-1 block w-full p-1.5 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full p-1.5 border border-gray-300 rounded-md"
              rows="3"
              required
            ></textarea>
          </div>

          {/* Course and Department */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Course</label>
              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="mt-1 block w-full p-1.5 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="mt-1 block w-full p-1.5 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          {/* Year of Study */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Year of Study</label>
            <input
              type="number"
              name="year_of_study"
              value={formData.year_of_study}
              onChange={handleChange}
              className="mt-1 block w-full p-1.5 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Profile Picture Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full p-1.5 border border-gray-300 rounded-md"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="mt-2 w-24 h-24 object-cover rounded-full border"
              />
            )}
          </div>

          {/* Error Message */}
          {error && <div className="text-red-600 text-sm">{error}</div>}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-1.5 rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentEditProfile;