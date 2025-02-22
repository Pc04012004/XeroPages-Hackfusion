import React from "react";

const MentalHealth = () => {
  // Function to open the chatbot
  const openChatbot = () => {
    if (window.Chatling && window.Chatling.open) {
      window.Chatling.open(); // Open the chatbot
    } else {
      console.error("Chatbot script not loaded or Chatling object not found.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center p-6">
      {/* Main Content */}
      <div className="max-w-4xl bg-white rounded-2xl shadow-2xl p-10 text-center space-y-8">
        <h1 className="text-5xl font-bold text-blue-800 mb-6">
          Hey there, College Warrior! 🎓
        </h1>
        <p className="text-gray-700 text-xl leading-relaxed">
          College life is a rollercoaster—full of highs, lows, and everything in between. 
          It's okay to feel overwhelmed, stressed, or even lost sometimes. 
          <span className="font-semibold text-blue-800"> You're not alone.</span> 
          We're here to remind you that it's okay to take a step back, breathe, and ask for help.
        </p>
        <p className="text-gray-700 text-xl leading-relaxed">
          Whether you're juggling assignments, dealing with personal struggles, or just need someone to talk to, 
          our chatbot is here to listen. It's like having a friend who's always available, 
          ready to support you through the tough moments.
        </p>
        <p className="text-gray-700 text-xl leading-relaxed font-semibold">
          Remember, taking care of your mental health is just as important as acing that exam. 💙
        </p>
        <button
          onClick={openChatbot}
          className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition duration-300 text-lg font-semibold shadow-lg hover:shadow-xl"
        >
          Talk to the Chatbot Now
        </button>
      </div>

      {/* Arrow pointing to the bottom right (chatbot location) */}
      <div className="fixed bottom-24 right-10 animate-bounce">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </div>
  );
};

export default MentalHealth;