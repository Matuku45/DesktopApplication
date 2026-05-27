import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-gray-50">

      {/* HERO SECTION */}
      <section className="bg-green-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to Bokang Foundation
          </h1>

          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-8">
            Empowering communities through education, outreach programs,
            youth development, and social support initiatives that create lasting impact.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link
              to="/volunteer"
              className="bg-white text-green-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200"
            >
              Become a Volunteer
            </Link>

            <Link
              to="/donate"
              className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-900"
            >
              Support Us
            </Link>
          </div>
        </div>
      </section>

      {/* MISSION SECTION */}
      <section className="py-16 max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-green-900 mb-4">
          Our Mission
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Our mission is to uplift communities by providing access to education,
          mentorship, and essential resources. We believe in creating opportunities
          that empower individuals to build a better future.
        </p>
      </section>

      {/* SERVICES SECTION */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-green-900 mb-10">
            What We Do
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Education Support</h3>
              <p className="text-gray-600">
                Providing learning resources, tutoring, and mentorship for students.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Community Outreach</h3>
              <p className="text-gray-600">
                Organizing events and programs to support vulnerable communities.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Youth Empowerment</h3>
              <p className="text-gray-600">
                Helping young people develop skills, confidence, and leadership.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="bg-green-100 py-16 text-center">
        <h2 className="text-3xl font-bold text-green-900 mb-4">
          Join Us in Making a Difference
        </h2>

        <p className="text-gray-700 max-w-2xl mx-auto mb-6">
          Your support helps us reach more people and create meaningful change
          in communities that need it most.
        </p>

        <Link
          to="/contact"
          className="bg-green-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800"
        >
          Get Involved
        </Link>
      </section>

    </div>
  );
};

export default Home;