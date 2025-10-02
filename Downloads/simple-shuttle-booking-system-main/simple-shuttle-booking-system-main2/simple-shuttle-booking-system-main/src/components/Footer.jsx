import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10 pt-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
        <div>
          <h3 className="font-bold text-white mb-2">Useful Links</h3>
          {["Home", "About Us", "Contact", "Support"].map((link) => (
            <a key={link} href="#" className="block mb-1 hover:underline">
              {link}
            </a>
          ))}
        </div>
        <div>
          <h3 className="font-bold text-white mb-2">Pricing</h3>
          {["Basic Plan", "Advanced Plan"].map((link) => (
            <a key={link} href="#" className="block mb-1 hover:underline">
              {link}
            </a>
          ))}
        </div>
        <div>
          <h3 className="font-bold text-white mb-2">Booking Solutions</h3>
          {["Airport Shuttle", "Hotel Transfer", "Limo Transfer"].map((link) => (
            <a key={link} href="#" className="block mb-1 hover:underline">
              {link}
            </a>
          ))}
        </div>
        <div>
          <h3 className="font-bold text-white mb-2">Customer Care</h3>
          {["Privacy", "Terms", "FAQs"].map((link) => (
            <a key={link} href="#" className="block mb-1 hover:underline">
              {link}
            </a>
          ))}
        </div>
        <div>
          <h3 className="font-bold text-white mb-2">Get in Touch</h3>
          <p>Shuttle Booking Pro</p>
          <p>+61 3 9001 6384</p>
          <p>support@shuttlebooking.com</p>
          <div className="flex gap-3 mt-2">
            {["Facebook", "Twitter", "Instagram"].map((social) => (
              <a key={social} href="#" className="hover:underline">
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="text-center text-gray-400 text-xs mt-6 pb-4">
        &copy; {new Date().getFullYear()} Shuttle Booking System. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
