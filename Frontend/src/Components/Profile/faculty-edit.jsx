import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function FacultyEditProfile() {
  const [formData, setFormData] = useState({
    user: null,
    name: "",
    dob: "",
    email: "",
    phone_no: "",
    gender: "Male",
    address: "",
    profile_picture: null,
    designation: "",
    department: "",
    qualification: "",
    years_of_experience: "",
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
        "https://xeropages.onrender.com/auth/faculty/profile/",
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
        setError("Failed to register faculty. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while registering. Please check the details.");
      console.error(err); // Log the error for debugging
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Register Faculty</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name and DOB */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
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

          {/* Gender and Address */}
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
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full p-1.5 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          {/* Designation and Department */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
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

          {/* Qualification and Years of Experience */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Qualification</label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                className="mt-1 block w-full p-1.5 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
              <input
                type="number"
                name="years_of_experience"
                value={formData.years_of_experience}
                onChange={handleChange}
                className="mt-1 block w-full p-1.5 border border-gray-300 rounded-md"
                required
              />
            </div>
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
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FacultyEditProfile;