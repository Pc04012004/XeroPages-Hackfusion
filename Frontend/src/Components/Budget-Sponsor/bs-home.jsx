import React, { useState, useEffect } from "react";
import axios from "axios";

function BSHome() {
  const [activeApplications, setActiveApplications] = useState([]); // State for active applications
  const [recentBudgets, setRecentBudgets] = useState([]); // State for recent budgets
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [representatives, setRepresentatives] = useState([]); // State for representatives
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    event_type: "",
    date: "",
    venue: "",
    description: "",
    r_name: "", // Representative name (dropdown)
    f_name: "",
  }); // State for form data
  const [budgetFormData, setBudgetFormData] = useState({
    event_id: "",
    budget_amount: "",
    budget: "",
  });


  // Fetch active applications, recent budgets, and representatives from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("access_token"); // Get access token from localStorage
        if (!accessToken) {
          throw new Error("No access token found. Please log in.");
        }

        // Fetch active applications (events, budgets, sponsorships)
        const applicationsResponse = await axios.get(
          "https://xeropages.onrender.com/event/events/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // Fetch recent budgets
        const budgetsResponse = await axios.get(
          "https://xeropages.onrender.com/event/event-budget/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // Fetch representatives
        const representativesResponse = await axios.get(
          "https://xeropages.onrender.com/event/representatives/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // Process and set the data
        setActiveApplications(applicationsResponse.data); // Assuming budgets are part of active applications
        setRecentBudgets(budgetsResponse.data); // Set recent budgets
        setRepresentatives(representativesResponse.data); // Set representatives
        setLoading(false); // Set loading to false
      } catch (err) {
        setError(err.message); // Set error message
        setLoading(false); // Set loading to false
      }
    };

    fetchData(); // Call the function to fetch data
  }, []);

  const handleBudgetInputChange = (e) => {
    const { name, value } = e.target;
    setBudgetFormData({
      ...budgetFormData,
      [name]: value,
    });
  };

  const openBudgetModal = (eventId) => {
    setSelectedEventId(eventId);
    setBudgetFormData({ event_id: eventId, budget_amount: "", budget_description: "" });
    setIsBudgetModalOpen(true);
  };
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        throw new Error("No access token found. Please log in.");
      }

      const response = await axios.post("https://xeropages.onrender.com/event/event-budget/", budgetFormData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.status === 200 || response.status === 201) {
        alert("Budget added successfully!");
        window.location.reload();
      }
    } catch (err) {
      alert(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        throw new Error("No access token found. Please log in.");
      }

      // Format date to "DD-MM-YYYY"
      const formattedDate = new Date(formData.date).toISOString().split("T")[0];
        // .toLocaleDateString("en-GB") // "en-GB" gives "DD/MM/YYYY"
        // .split("/")
        // .join("-"); // Convert "/" to "-"

      const requestData = { ...formData, date: formattedDate };

      const response = await axios.post(
        "https://xeropages.onrender.com/event/events/",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      alert("Event created successfully!");
      window.location.reload();
    } catch (err) {
      alert(`Error: ${err.response?.data?.message || err.message}`);
    }
};


  // Handle loading and error states
  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">College Budget and Sponsorship Portal</h1>
      </header>

      {/* Application Dashboard */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Application Dashboard</h2>
        <p className="text-gray-600 mb-6">
          Submit and track your applications for events, budgets, and sponsorships
        </p>

        {/* Buttons for New Requests */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            New Event Request
          </button>
          <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-300">
            Budget Approval
          </button>
          <button className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition duration-300">
            Sponsorship Request
          </button>
        </div>

        {isBudgetModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Add Budget</h3>
            <form onSubmit={handleBudgetSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Budget Amount</label>
                <input
                  type="text"
                  name="budget_amount"
                  value={budgetFormData.budget_amount}
                  onChange={handleBudgetInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Budget Description</label>
                <textarea
                  name="budget"
                  value={budgetFormData.budget}
                  onChange={handleBudgetInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button onClick={() => setIsBudgetModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )};

        {/* Modal for New Event Request */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">New Event Request</h3>
              <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Event Type */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Event Type</label>
                  <input
                    type="text"
                    name="event_type"
                    value={formData.event_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Date */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Date</label>
                  <input
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Venue */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Venue</label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Representative Name (Dropdown) */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Representative Name</label>
                  <select
                    name="r_name"
                    value={formData.r_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a representative</option>
                    {representatives.map((rep) => (
                      <option key={rep.id} value={rep.designation}>
                        {rep.designation}
                      </option>
                    ))}
                  </select>
                </div>

                {/* F Name */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">F Name</label>
                  <input
                    type="text"
                    name="f_name"
                    value={formData.f_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Active Applications Table */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Active Applications</h3>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-gray-600">ID</th>
                <th className="py-2 text-gray-600">Date</th>
                <th className="py-2 text-gray-600">Title</th>
                <th className="py-2 text-gray-600">Status</th>
                <th className="py-2 text-gray-600">Type</th>
                <th className="py-2 text-gray-600">Venue</th>
                <th className="py-2 text-gray-600">Budget</th>

              </tr>
            </thead>
            <tbody>
              {activeApplications.map((application) => (
                <tr key={application.id} className="border-b hover:bg-gray-50 transition duration-300">
                  <td className="py-3 text-gray-700">#{application.id}</td>
                  <td className="py-3 text-gray-700">{application.date}</td>
                  <td className="py-3 text-gray-700">{application.name || "N/A"}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        application.status !== "PENDING"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {application.status}
                    </span>
                  </td>
                  <td className="py-3 text-gray-700">{application.event_type}</td>
                  <td className="py-3 text-gray-700">
                    {application.venue}
                  </td>
                    <td className="py-3">
                        <button onClick={() => openBudgetModal(application.id)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        Add Budget
                        </button>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Budget Uploads */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Budget Uploads</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentBudgets.map((budget) => (
              <div key={budget.id} className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">
                  {new Date(budget.created_at).toLocaleDateString()}
                </p>
                <h4 className="text-lg font-semibold text-gray-700 mt-2">
                  {budget.event?.name || "N/A"}
                </h4>
                <p className="text-2xl font-bold text-gray-800 mt-2">
                  ${budget.budget_amount}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default BSHome;