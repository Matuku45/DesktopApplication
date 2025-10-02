import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import PassengerDashboard from "./pages/PassengerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import About from "./pages/About";

function App() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header
          onSignUpClick={() => setShowSignUp(true)}
          onLoginClick={() => setShowLogin(true)}
        />

        <main className="flex-grow p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/passenger" element={<PassengerDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
          </Routes>

          {/* Optional popups */}
          {showSignUp && <SignUp onClose={() => setShowSignUp(false)} />}
          {showLogin && <Login onClose={() => setShowLogin(false)} />}
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
