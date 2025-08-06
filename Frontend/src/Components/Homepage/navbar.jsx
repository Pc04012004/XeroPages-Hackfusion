import { useState } from "react";
import { Bell, Search, User, ShoppingCart } from "lucide-react";
import { useNavigate } from 'react-router-dom';

function NavBar() {
  const navigate = useNavigate();
  const [searchItem, setSearchItem] = useState('');

  const menuItems = [
    { label: "Elections", link: "/elections" },
    { label: "Support Bot", link: "/home/mental-health" },
    { label: "Facility Booking", link: "/home/campus-facility" },
    { label: "Complaints", link: "/home/complaints" },
    { label: "Budget Tracking", link: "/home/budget-sponsor" },
  ];

  function handleSearchChange(event) {
    setSearchItem(event.target.value);
  }

  function handleHomeClick() {
    navigate('/home'); // Navigate to home when logo is clicked
  }

  return (
    <nav className="flex items-center justify-between shadow-md bg-white p-4">
      {/* Logo */}
      <div className="flex items-center cursor-pointer" onClick={handleHomeClick}>
        <div className="w-8 h-8 bg-black rounded-full mr-2"></div>
        <span className="text-lg font-semibold">XeroPages</span>
      </div>

      {/* Navigation Links */}
      <div className="flex space-x-6 font-semibold">
        {menuItems.map((menu, index) => (
          <div
            key={index}
            className="cursor-pointer hover:underline"
            onClick={() => navigate(menu.link)}
          >
            {menu.label}
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
        <User className="w-6 h-6 cursor-pointer" onClick={() => navigate('/home/profile')} />
      </div>
    </nav>
  );
}

export default NavBar;