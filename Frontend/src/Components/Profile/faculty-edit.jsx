import React, { useState } from 'react';

function FacultyEditProfile() {
  const [profile, setProfile] = useState({
    name: "Dr. Jane Smith",
    dob: "1980-08-22",
    email: "janesmith@example.com",
    phone_no: "+1987654321",
    gender: "Female",
    profile_picture: null,
    designation: "Professor",
    department: "Mathematics",
    qualification: "Ph.D. in Applied Mathematics",
    years_of_experience: 15,
  });

  const [systemPassword, setSystemPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === 'newPassword') {
      setNewPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    console.log('Updated Profile:', profile);
    console.log('New Password:', newPassword);
    // Add API call to save the updated profile and password
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name and Date of Birth in the same row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
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
                value={profile.dob}
                onChange={handleChange}
                className="mt-1 block w-full p-1.5 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          {/* Email and Phone Number in the same row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
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
                value={profile.phone_no}
                onChange={handleChange}
                className="mt-1 block w-full p-1.5 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          {/* Gender and System Generated Password in the same row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                name="gender"
                value={profile.gender}
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
              <label className="block text-sm font-medium text-gray-700">System Generated Password</label>
              <input
                type="password"
                name="systemPassword"
                value={systemPassword}
                onChange={(e) => setSystemPassword(e.target.value)}
                className="mt-1 block w-full p-1.5 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          {/* Designation and Department in the same row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Designation</label>
              <input
                type="text"
                name="designation"
                value={profile.designation}
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
                value={profile.department}
                onChange={handleChange}
                className="mt-1 block w-full p-1.5 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          {/* Qualification and Years of Experience in the same row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Qualification</label>
              <input
                type="text"
                name="qualification"
                value={profile.qualification}
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
                value={profile.years_of_experience}
                onChange={handleChange}
                className="mt-1 block w-full p-1.5 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          {/* New Password and Confirm Password in the same row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={newPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full p-1.5 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full p-1.5 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          {/* Password Error Message */}
          {passwordError && (
            <div className="text-red-600 text-sm">
              {passwordError}
            </div>
          )}

          {/* Save Changes Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FacultyEditProfile;