import React from 'react';

const About = () => (
  <div className="max-w-xl mx-auto my-10 bg-gradient-to-br from-[#f1faee] to-[#e0eafc] rounded-xl shadow-lg p-8 text-[#1d3557] font-sans">
    {/* Emoji Header */}
    <div className="text-center text-4xl mb-3">🚌</div>

    {/* Title */}
    <h1 className="text-2xl sm:text-3xl font-bold text-[#457b9d] text-center mb-4">
      About Us
    </h1>

    {/* Intro Paragraph */}
    <p className="text-base sm:text-lg mb-6">
      Our Shuttle Booking System is designed to make your travel planning{' '}
      <span className="bg-[#a8dadc] rounded px-2 py-0.5 font-semibold">simple</span>,{' '}
      <span className="bg-[#a8dadc] rounded px-2 py-0.5 font-semibold">fast</span>, and{' '}
      <span className="bg-[#a8dadc] rounded px-2 py-0.5 font-semibold">reliable</span>.
    </p>

    {/* Booking Steps */}
    <h2 className="text-xl font-bold text-[#1d3557] my-6">How the Booking System Works</h2>
    <ol className="list-decimal list-inside space-y-4 text-gray-800">
      <li>
        <strong>Sign In:</strong> Passengers must log in or create an account to make a booking.
      </li>
      <li>
        <strong>Search for a Shuttle:</strong> Choose your departure location, destination, and travel date.
      </li>
      <li>
        <strong>View Available Shuttles:</strong> The system displays all scheduled shuttles for the selected day, including:
        <ul className="list-disc list-inside ml-5 mt-2 space-y-1">
          <li>Departure time</li>
          <li>Number of available seats</li>
          <li>Price per seat</li>
        </ul>
      </li>
      <li>
        <strong>Select and Book:</strong> Choose your preferred shuttle and number of seats. Confirm your booking.
      </li>
      <li>
        <strong>Make Payment:</strong> Pay securely online via integrated payment gateways.
      </li>
      <li>
        <strong>Confirmation:</strong> Once payment is successful, your booking is confirmed and stored in your profile.
        <br />You may receive an optional email confirmation.
      </li>
    </ol>

    {/* Why Choose Us */}
    <h2 className="text-xl font-bold text-[#1d3557] my-6">Why Choose Us?</h2>
    <ul className="list-disc list-inside space-y-3 text-gray-800">
      <li>
        <strong>Scheduled Service:</strong> Our shuttles run on fixed schedules for your convenience.
      </li>
      <li>
        <strong>Real-Time Availability:</strong> Seat availability updates automatically after each booking.
      </li>
      <li>
        <strong>Secure Payments:</strong> All transactions are processed through trusted payment gateways.
      </li>
      <li>
        <strong>User-Friendly Interface:</strong> Enjoy a smooth and easy booking experience.
      </li>
    </ul>
  </div>
);

export default About;
