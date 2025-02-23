import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Hero(props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const role = props.userRole;

  // Events data for the slider
  const events = [
    {
      title: "Annual Sports Meet",
      description: "Join us for an exciting day of sports and fun activities!",
      date: "March 25, 2025",
      image: "https://via.placeholder.com/1600x600?text=Event+1",
    },
    {
      title: "Art Exhibition",
      description: "Explore beautiful art by emerging artists from all over the world.",
      date: "April 10, 2025",
      image: "https://via.placeholder.com/1600x600?text=Event+2",
    },
    {
      title: "Tech Talk: AI Future",
      description: "A deep dive into the future of AI with industry experts.",
      date: "May 5, 2025",
      image: "https://via.placeholder.com/1600x600?text=Event+3",
    },
  ];

  // Features data
  const features = [
    {
      title: "Student Election System",
      description: "Online election platform for student councils with candidate profiles and secure voting.",
      link: "/elections",
      overview: {
        latestEvent: "Elections for Student Council 2025",
        status: "Ongoing",
        details: "Vote now for your favorite candidates!",
      },
    },
    {
      title: "Automated Health & Leave Notifications",
      description: "Automated health notifications and parental alerts ensure student safety.",
      link: `/home/health-notifications/${role}`,
      overview: {
        latestNotification: "Health Checkup on March 30, 2025",
        status: "Upcoming",
        details: "All students are required to attend.",
      },
    },
    {
      title: "Campus Facility Booking System",
      description: "Effortlessly book campus facilities with an online booking platform.",
      link: "/home/campus-facility",
      overview: {
        latestBooking: "Auditorium booked for Tech Fest on April 15, 2025",
        status: "Booked",
        details: "Contact admin for more details.",
      },
    },
    {
      title: "Transparent Application & Approval System",
      description: "A seamless portal for real-time application submissions and approvals.",
      link: "/applications",
      overview: {
        latestApplication: "New event proposal: Cultural Fest 2025",
        status: "Pending Approval",
        details: "Submitted by Student Council.",
      },
    },
    {
      title: "Academic Integrity & Cheating Record System",
      description: "Maintaining academic integrity by publicly displaying cheating records.",
      link: "/home/cheating",
      overview: {
        latestRecord: "No recent cheating cases reported.",
        status: "Clean",
        details: "Maintain academic honesty!",
      },
    },
    {
      title: "Anonymous Complaint System",
      description: "Submit anonymous complaints with moderation and transparency.",
      link: "/home/complaints",
      overview: {
        latestComplaint: "Complaint about cafeteria cleanliness",
        status: "Under Review",
        details: "Submitted anonymously.",
      },
    },
    {
      title: "Transparent College Budget & Sponsorship Tracking",
      description: "Track college budgets and sponsorships with full transparency.",
      link: "/home/budget-sponsor",
      overview: {
        latestUpdate: "New sponsorship from TechCorp: $10,000",
        status: "Approved",
        details: "Funds allocated for Tech Fest 2025.",
      },
    },
    {
      title: "Support Bot",
      description: "helps you navigate throughout website, clear all the Queries and provides assistance",
      link: "/home/mental-health",
      overview: {
        latestActivity: "New login from admin@college.com",
        status: "Open",
        details: "Address any Queries related to website",
      },
    },
  ];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length);
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Events Slider */}
      <div className="w-full h-[90vh] flex items-center justify-center relative">
        {/* Left Arrow */}
        <div
          className="absolute left-0 top-1/2 transform -translate-y-1/2 p-4 cursor-pointer z-10"
          onClick={handlePrev}
          aria-label="Previous Slide"
        >
          <ChevronLeft className="text-white w-8 h-8" />
        </div>

        {/* Slider Content */}
        <div className="flex w-full h-full">
          <div
            className="flex-shrink-0 w-full h-full bg-cover bg-center transition-all duration-300"
            style={{ backgroundImage: `url(${events[currentIndex].image})` }}
          >
            <div className="flex justify-center items-center h-full bg-black bg-opacity-50">
              <div className="text-center text-white px-4 py-6 max-w-4xl">
                <h2 className="text-5xl font-bold mb-6">{events[currentIndex].title}</h2>
                <p className="text-2xl mb-6">{events[currentIndex].description}</p>
                <p className="text-xl">{events[currentIndex].date}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Arrow */}
        <div
          className="absolute right-0 top-1/2 transform -translate-y-1/2 p-4 cursor-pointer z-10"
          onClick={handleNext}
          aria-label="Next Slide"
        >
          <ChevronRight className="text-white w-8 h-8" />
        </div>
      </div>

      {/* Features Overview Section */}
      <div className="w-full bg-gray-100 py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Key Features Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <div className="mb-6">
                  <h4 className="text-lg font-semibold">Latest Update:</h4>
                  <p className="text-gray-600">{feature.overview.latestEvent || feature.overview.latestNotification || feature.overview.latestBooking || feature.overview.latestApplication || feature.overview.latestRecord || feature.overview.latestComplaint || feature.overview.latestUpdate || feature.overview.latestActivity}</p>
                  <p className="text-sm text-gray-500 mt-2">Status: {feature.overview.status}</p>
                  <p className="text-sm text-gray-500">{feature.overview.details}</p>
                </div>
                <button
                  onClick={() => navigate(feature.link)}
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors duration-300"
                >
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;