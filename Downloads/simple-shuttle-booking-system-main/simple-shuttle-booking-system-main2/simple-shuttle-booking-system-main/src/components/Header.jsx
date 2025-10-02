import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = ({ onSignUpClick, onLoginClick }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Passenger Dashboard", path: "/passenger" },  // added
    { name: "Admin Dashboard", path: "/admin" },          // added
    { name: "Sign Up", path: "/signup" },
    { name: "Login", path: "/login" },
  ];

  return (
    <header className="w-full bg-blue-900 text-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3 sm:px-6">
        <div className="text-xl sm:text-2xl font-bold tracking-wide">
          Shuttle Booking Pro
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="px-3 py-1 font-medium hover:underline text-yellow-300"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-white text-3xl focus:outline-none"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileOpen && (
        <div className="md:hidden flex flex-col bg-blue-800 px-4 py-2 gap-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className="block w-full text-left text-yellow-300 font-medium hover:underline px-2 py-1"
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
