import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-green-950 text-white mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* About */}
        <div>
          <h2 className="text-xl font-bold mb-3">Bokang Foundation</h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Bokang Foundation is dedicated to empowering communities through
            education, support programs, outreach events, and volunteer work.
            Together we build a better future.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-gray-300">Home</Link></li>
            <li><Link to="/about" className="hover:text-gray-300">About</Link></li>
            <li><Link to="/events" className="hover:text-gray-300">Events</Link></li>
            <li><Link to="/gallery" className="hover:text-gray-300">Gallery</Link></li>
            <li><Link to="/contact" className="hover:text-gray-300">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Contact Us</h2>
          <p className="text-sm text-gray-300">
            Email: info@bokangfoundation.org
          </p>
          <p className="text-sm text-gray-300">
            Phone: +27 00 000 0000
          </p>
          <p className="text-sm text-gray-300">
            Location: South Africa
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-green-800 text-center py-4 text-sm text-gray-400">
        © {new Date().getFullYear()} Bokang Foundation. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;