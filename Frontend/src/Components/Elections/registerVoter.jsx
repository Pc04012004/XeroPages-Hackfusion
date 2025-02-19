import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterVoter(){
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    collegeEmail: '',
    registrationNumber: '',
    electionPosition: '',
    idProof: null,
  });
  const [otp, setOtp] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);

  // Simulated election positions (can be fetched from backend or context)
  const electionPositions = [
    { title: 'CS', description: 'Class Representative for Computer Science Department' },
    { title: 'QS', description: 'Class Representative for Quality Sciences Department' },
    { title: 'SS', description: 'Class Representative for Social Sciences Department' },
    { title: 'TS', description: 'Class Representative for Technical Sciences Department' },
    { title: 'Mess', description: 'Mess Committee Representative' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = (e) => {
    setFormData({ ...formData, idProof: e.target.files[0] });
  };

  const handleSendOtp = () => {
    // Simulate OTP sending
    setShowOtpField(true);
    alert('OTP sent to your email!');
  };

  const handleVerifyOtp = () => {
    // Simulate OTP verification
    if (otp === '123456') {
      setIsEmailVerified(true);
      alert('Email verified successfully!');
    } else {
      alert('Invalid OTP!');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEmailVerified) {
      alert('Please verify your email first!');
      return;
    }
    console.log('Form Data:', formData);
    alert('Voter registration successful!');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Register as Voter</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">College Email:</label>
            <div className="flex space-x-2">
              <input
                type="email"
                name="collegeEmail"
                value={formData.collegeEmail}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <button
                type="button"
                onClick={handleSendOtp}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                Send OTP
              </button>
            </div>
            {showOtpField && (
              <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Enter OTP:</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300"
                  >
                    Verify OTP
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Registration Number:</label>
            <input
              type="text"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Election Position:</label>
            <select
              name="electionPosition"
              value={formData.electionPosition}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            >
              <option value="">Select Position</option>
              {electionPositions.map((position, index) => (
                <option key={index} value={position.title}>
                  {position.title} - {position.description}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Upload ID Proof (Aadhar Card):</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Register as Voter
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterVoter;