import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import PassengerDashboard from '../pages/PassengerDashboard';
import About from '../pages/About';
import SignUp from '../pages/SignUp';
import Login from '../pages/Login';

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<PassengerDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/about" element={<About />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      {/* Add more routes as needed */}
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;  