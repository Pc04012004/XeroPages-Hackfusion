import { useState, useEffect, useRef } from "react";
import { Bell, Search, User, ShoppingCart, ChevronDown } from "lucide-react";
import { useNavigate } from 'react-router-dom';

function NavBar() {
  const navigate = useNavigate();
  const [searchItem, setSearchItem] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const navbarRef = useRef(null); // Ref to the navbar container

  function handleSearchChange(event) {
    setSearchItem(event.target.value);
  }

  const menuItems = [
    {
      label: "Elections",
      subItems: [
        { text: "📋 View Candidates", link: "/elections/candidates" },
        { text: "🗳 Register for Election", link: "/elections/register" },
        { text: "📊 Live Results", link: "/elections/results" },
        { text: "📅 Election Schedule", link: "/elections/schedule" },
        { text: "📜 Election Rules & Guidelines", link: "/elections/rules" },
        { text: "📑 Past Elections & Results", link: "/elections/past-results" },
      ],
    },
    {
      label: "Approvals",
      subItems: [
        { text: "📌 Pending Approvals", link: "/approvals/pending" },
        { text: "📑 My Applications", link: "/approvals/my-applications" },
        { text: "🎭 Event Budget Requests", link: "/approvals/event-budget" },
        { text: "💰 Sponsorship Approvals", link: "/approvals/sponsorship" },
        { text: "📆 Leave & Health Approvals", link: "/approvals/leave-health" },
        { text: "🛠 Facility Booking Approvals", link: "/approvals/facility-booking" },
        { text: "📜 Approval Guidelines & Policies", link: "/approvals/guidelines" },
      ],
    },
    {
      label: "Facility Booking",
      subItems: [
        { text: "📆 Book a Facility", link: "/facility-booking/book" },
        { text: "📋 My Bookings", link: "/facility-booking/my-bookings" },
        { text: "🔍 Check Availability", link: "/facility-booking/availability" },
        { text: "✅ Approval Status", link: "/facility-booking/status" },
        { text: "📜 Booking Rules & Guidelines", link: "/facility-booking/rules" },
      ],
    },
    {
      label: "Complaints",
      subItems: [
        { text: "📝 File a Complaint", link: "/complaints/file" },
        { text: "📜 View Complaints", link: "/complaints/view" },
        { text: "📊 Complaint Status", link: "/complaints/status" },
        { text: "🔍 Moderation & Review", link: "/complaints/moderation" },
        { text: "⚖ Complaint Policy & Guidelines", link: "/complaints/policy" },
      ],
    },
    {
      label: "Budget Tracking",
      subItems: [
        { text: "💰 View College Budget", link: "/budget/view" },
        { text: "📑 Expense Reports", link: "/budget/expense-reports" },
        { text: "🔍 Budget Breakdown", link: "/budget/breakdown" },
        { text: "📆 Past Budgets & Spending Trends", link: "/budget/past-budgets" },
        { text: "📜 Budget Policies & Guidelines", link: "/budget/policies" },
      ],
    },
  ];

  // Detect clicks outside of the navbar
  useEffect(() => {
    function handleClickOutside(event) {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setActiveDropdown(null); // Close dropdown when clicking outside
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleHomeClick() {
    navigate('/home'); // Navigate to home when logo is clicked
  }

  return (
    <nav ref={navbarRef} className="relative flex items-center justify-between shadow-md bg-white p-4">
      {/* Logo */}
      <div className="flex items-center cursor-pointer" onClick={handleHomeClick}>
        <div className="w-8 h-8 bg-black rounded-full mr-2"></div>
        <span className="text-lg font-semibold">XeroPages</span>
      </div>

      {/* Navigation Links */}
      <div className="flex space-x-6 font-semibold relative">
        {menuItems.map((menu, index) => (
          <div
            key={index}
            className="relative cursor-pointer hover:underline"
            onMouseEnter={() => {
              setActiveDropdown(menu.label);
              setIsHovered(true);
            }}
            onMouseLeave={() => {
              if (!isHovered) {
                setActiveDropdown(null);
              }
            }}
          >
            <span className="flex items-center" onClick={() => navigate('/elections')}>
              {menu.label} <ChevronDown className="ml-2 w-4 h-4" />
            </span>
          </div>
        ))}
      </div>

      {/* Right-Side Functionalities */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center border rounded-full px-4 py-1">
          <Search className="w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            value={searchItem}
            onChange={handleSearchChange}
            className="outline-none bg-transparent w-32 focus:w-48 transition-all duration-300"
          />
        </div>
        <Bell className="w-6 h-6 cursor-pointer" />
        <ShoppingCart className="w-6 h-6 cursor-pointer" />
        <User className="w-6 h-6 cursor-pointer" />
      </div>

      {/* Common Dropdown Menu */}
      <div
        className={`absolute left-0 top-full w-full bg-white shadow-lg border-t z-50 p-4 transition-all duration-300 ease-in-out ${
          activeDropdown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {activeDropdown &&
          menuItems
            .find((menu) => menu.label === activeDropdown)
            ?.subItems.map((subItem, subIndex) => (
              <div
                key={subIndex}
                className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                onClick={() => navigate(subItem.link)}
              >
                {subItem.text}
              </div>
            ))}
      </div>
    </nav>
  );
}

export default NavBar;