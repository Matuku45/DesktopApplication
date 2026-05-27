import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-green-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        
        {/* Logo */}
        <div className="text-xl font-bold">
          Bokang Foundation
        </div>

        {/* Hamburger Icon */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>

        {/* Nav Links */}
        <nav
          className={`absolute md:static top-16 left-0 w-full md:w-auto bg-green-900 md:bg-transparent transition-all duration-300 ease-in-out ${
            isOpen ? "block" : "hidden"
          } md:block`}
        >
          <ul className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 p-4 md:p-0">
            <li><Link to="/" className="hover:text-gray-300">Home</Link></li>
            <li><Link to="/about" className="hover:text-gray-300">About</Link></li>
            <li><Link to="/events" className="hover:text-gray-300">Events</Link></li>
            <li><Link to="/gallery" className="hover:text-gray-300">Gallery</Link></li>
            <li><Link to="/quotes" className="hover:text-gray-300">Quotes</Link></li>
            <li><Link to="/feedback" className="hover:text-gray-300">Feedback</Link></li>
            <li><Link to="/volunteer" className="hover:text-gray-300">Volunteer</Link></li>
            <li><Link to="/contact" className="hover:text-gray-300">Contact</Link></li>
          </ul>

          {/* Auth Buttons */}
          <div className="flex flex-col md:flex-row gap-2 md:ml-6 p-4 md:p-0">
            <Link
              to="/login"
              className="border border-white px-3 py-1 rounded hover:bg-white hover:text-green-900"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white text-green-900 px-3 py-1 rounded hover:bg-gray-200"
            >
              Register
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;