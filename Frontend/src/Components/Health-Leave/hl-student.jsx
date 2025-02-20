import React from "react";
import { CalendarPlus, History, HeartPulse } from "lucide-react";
import NavBar from "../Homepage/navbar";
import Footer from "../Homepage/footer";

function StudentDashboard() {
  // Static data for leave requests
  const leaveRequests = [
    {
      id: 1,
      requestId: "RLR2025001",
      type: "Medical",
      from: "Jan 15, 2025",
      to: "Jan 18, 2025",
      status: "Pending",
    },
    {
      id: 2,
      requestId: "RLR2025002",
      type: "Personal",
      from: "Jan 10, 2025",
      to: "Jan 12, 2025",
      status: "Approved",
    },
    {
      id: 3,
      requestId: "RLR2025003",
      type: "Emergency",
      from: "Jan 5, 2025",
      to: "Jan 6, 2025",
      status: "Rejected",
    },
  ];

  const handleViewDetails = (requestId) => {
    // Placeholder for viewing leave request details
    console.log("View details for request ID:", requestId);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>

      {/* Quick Actions Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex space-x-6">
          {[
            { text: "Request Leave", icon: <CalendarPlus size={28} />, action: () => console.log("Request Leave clicked") },
            { text: "Leave History", icon: <History size={28} />, action: () => console.log("Leave History clicked") },
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
          <table className="w-full text-sm text-gray-700">
            <thead>
              <tr className="border-b">
                <th className="py-3 font-medium">Request ID</th>
                <th className="py-3 font-medium">Type</th>
                <th className="py-3 font-medium">From</th>
                <th className="py-3 font-medium">To</th>
                <th className="py-3 font-medium">Status</th>
                <th className="py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.length > 0 ? (
                leaveRequests.map((request) => (
                  <tr key={request.id} className="border-b">
                    <td className="py-3">{request.requestId}</td>
                    <td className="py-3">{request.type}</td>
                    <td className="py-3">{request.from}</td>
                    <td className="py-3">{request.to}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          request.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : request.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => handleViewDetails(request.requestId)}
                        className="text-blue-600 hover:underline"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-3 text-center text-gray-500">
                    No leave requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
