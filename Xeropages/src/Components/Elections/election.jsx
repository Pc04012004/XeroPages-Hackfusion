import React from 'react';
import NavBar from '../Homepage/navbar';
import Footer from '../Homepage/footer';
import { useNavigate } from 'react-router-dom';

function Election() {
  const navigate = useNavigate();

  // Sample data for upcoming elections
  const upcomingElections = [
    {
      id: 1,
      post: 'Student Council President',
      description: 'Elections for the head of the student governance body. Vote for your preferred candidate!',
      date: '2024-03-15',
    },
    {
      id: 2,
      post: 'Cultural Secretary',
      description: 'Elections for the cultural event coordinator. Responsible for organizing college festivals and events.',
      date: '2024-03-20',
    },
    {
      id: 3,
      post: 'Sports Captain',
      description: 'Elections for the sports captain. Lead and represent the college in sports activities.',
      date: '2024-03-25',
    },
  ];

  return (
    <>
      <NavBar />
      <div className="bg-gray-100">
        {/* Upcoming Elections Section */}
        <div className="max-w-7xl mx-auto px-8 py-12">
          <h1 className="text-4xl font-bold mb-8 text-center">Upcoming Elections</h1>

          {/* Election Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingElections.map((election) => (
              <div
                key={election.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 cursor-pointer"
                onClick={() => navigate('/elections/register')}
              >
                <h2 className="text-2xl font-bold text-blue-600 mb-3">{election.post}</h2>
                <p className="text-gray-600 mb-4">{election.description}</p>
                <div className="flex items-center justify-between">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {new Date(election.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="text-gray-500 text-sm">Upcoming</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Election;