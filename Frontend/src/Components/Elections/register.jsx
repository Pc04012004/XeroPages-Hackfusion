import React, { useState } from 'react';

function Register() {
  const [activeModal, setActiveModal] = useState(null);
  const [voters, setVoters] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [pendingCandidates, setPendingCandidates] = useState([]);
  const [voterForm, setVoterForm] = useState({
    name: '',
    regNumber: '',
    email: '',
    idProof: null
  });
  const [candidateForm, setCandidateForm] = useState({
    name: '',
    regNumber: '',
    course: '',
    year: '',
    manifesto: ''
  });

  const handleVoterSubmit = (e) => {
    e.preventDefault();
    // Add voter registration logic
    setVoters([...voters, voterForm]);
    setVoterForm({ name: '', regNumber: '', email: '', idProof: null });
    setActiveModal(null);
  };

  const handleCandidateSubmit = (e) => {
    e.preventDefault();
    // Add candidate registration logic
    setPendingCandidates([...pendingCandidates, candidateForm]);
    setCandidateForm({ name: '', regNumber: '', course: '', year: '', manifesto: '' });
    setActiveModal(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto text-center">
        {/* Heading */}
        <h1 className="text-4xl font-bold mb-8">Register for Election</h1>

        {/* Registration Options */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveModal('voter')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all text-lg"
          >
            Register as Voter
          </button>
          <button
            onClick={() => setActiveModal('nominee')}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-all text-lg"
          >
            Register as Nominee
          </button>
        </div>

        {/* Voter Registration Modal */}
        {activeModal === 'voter' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Voter Registration</h2>
              <form onSubmit={handleVoterSubmit}>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full p-2 border rounded"
                    value={voterForm.name}
                    onChange={(e) => setVoterForm({...voterForm, name: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Registration Number"
                    className="w-full p-2 border rounded"
                    value={voterForm.regNumber}
                    onChange={(e) => setVoterForm({...voterForm, regNumber: e.target.value})}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 border rounded"
                    value={voterForm.email}
                    onChange={(e) => setVoterForm({...voterForm, email: e.target.value})}
                    required
                  />
                  <div>
                    <label className="block text-left mb-2">Upload ID Proof</label>
                    <input
                      type="file"
                      className="w-full p-2 border rounded"
                      onChange={(e) => setVoterForm({...voterForm, idProof: e.target.files[0]})}
                      required
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                  >
                    Register
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Nominee Registration Modal */}
        {activeModal === 'nominee' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Nominee Registration</h2>
              <form onSubmit={handleCandidateSubmit}>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full p-2 border rounded"
                    value={candidateForm.name}
                    onChange={(e) => setCandidateForm({...candidateForm, name: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Registration Number"
                    className="w-full p-2 border rounded"
                    value={candidateForm.regNumber}
                    onChange={(e) => setCandidateForm({...candidateForm, regNumber: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Course"
                    className="w-full p-2 border rounded"
                    value={candidateForm.course}
                    onChange={(e) => setCandidateForm({...candidateForm, course: e.target.value})}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Year"
                    className="w-full p-2 border rounded"
                    value={candidateForm.year}
                    onChange={(e) => setCandidateForm({...candidateForm, year: e.target.value})}
                    required
                  />
                  <textarea
                    placeholder="Manifesto"
                    className="w-full p-2 border rounded h-32"
                    value={candidateForm.manifesto}
                    onChange={(e) => setCandidateForm({...candidateForm, manifesto: e.target.value})}
                    required
                  />
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;