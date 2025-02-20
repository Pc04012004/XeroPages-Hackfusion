import React, { useEffect, useState } from "react";
import axios from "axios";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("access_token"); // Assuming token is stored in localStorage
        const user = JSON.parse(localStorage.getItem("user")); // Retrieve and parse
        const userId = user ? user.user_id : null;
        console.log(userId);
        const response = await axios.get(`http://127.0.0.1:8000/auth/studentProfile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (err) {
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-4 mb-6 border-b pb-4">
          <img
            src={user.profile_picture || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-24 h-24 rounded-full shadow-md"
          />
          <div>
            <h1 className="text-2xl font-bold">{user.full_name}</h1>
            <p className="text-gray-600">{user.course}, {user.department}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Student Details</h2>
            <table className="w-full text-sm text-gray-700">
              <tbody>
                {[ 
                  { label: "Student ID", value: user.id },
                  { label: "Registration No", value: user.registration_no },
                  { label: "Course", value: user.course },
                  { label: "Department", value: user.department },
                  { label: "Year of Study", value: user.year_of_study },
                  { label: "Email ID", value: user.email },
                  { label: "Mobile No", value: user.phone_no },
                  { label: "Hostel Status", value: user.hostel_status ? "Yes" : "No" },
                ].map(({ label, value }) => (
                  <tr key={label} className="border-b">
                    <td className="py-2 font-medium">{label}</td>
                    <td className="py-2 text-gray-900">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            <table className="w-full text-sm text-gray-700">
              <tbody>
                {[ 
                  { label: "Full Name", value: user.full_name },
                  { label: "Gender", value: user.gender },
                  { label: "Birth Date", value: user.dob },
                  { label: "Address", value: user.address },
                  { label: "Nationality", value: "Unknown" }, // Not provided in JSON
                  { label: "Languages", value: "Unknown" }, // Not provided in JSON
                ].map(({ label, value }) => (
                  <tr key={label} className="border-b">
                    <td className="py-2 font-medium">{label}</td>
                    <td className="py-2 text-gray-900">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
