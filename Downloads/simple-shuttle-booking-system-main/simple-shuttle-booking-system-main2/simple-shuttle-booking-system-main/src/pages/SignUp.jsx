import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- import navigate

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
    role: "",
    agree: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); // <-- initialize navigate

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
    setSuccess("");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.name || !form.email || !form.password || !form.repeatPassword || !form.role) {
      setError("Please fill in all fields.");
      return;
    }

    if (form.password !== form.repeatPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!form.agree) {
      setError("You must agree to the Terms of service.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        setError("");
        // Reset form
        setForm({
          name: "",
          email: "",
          password: "",
          repeatPassword: "",
          role: "",
          agree: false,
        });

        // Redirect to login page after successful signup
        navigate("/login");
      } else {
        setError(data.message || "Something went wrong");
        setSuccess("");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
      setSuccess("");
    }
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{
        backgroundImage:
          "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp')",
      }}
    >
      <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-lg p-8 sm:p-10 w-full max-w-md">
        <div className="text-center mb-6">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
            alt="logo"
            className="w-36 mx-auto sm:w-44"
          />
          <h4 className="mt-2 text-gray-700 text-lg sm:text-xl font-semibold">
            We are The Lotus Team
          </h4>
        </div>

        <h2 className="text-center text-blue-800 font-bold text-xl sm:text-2xl uppercase mb-8">
          Create an account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full p-3 border border-blue-400 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full p-3 border border-blue-400 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 border border-blue-400 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="repeatPassword"
            value={form.repeatPassword}
            onChange={handleChange}
            placeholder="Repeat your password"
            className="w-full p-3 border border-blue-400 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-3 border border-blue-400 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="passenger">Passenger</option>
          </select>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
              id="agree"
              className="mr-2 w-4 h-4 text-blue-600 accent-blue-600"
            />
            <label htmlFor="agree" className="text-gray-700 text-sm sm:text-base">
              I agree to the{" "}
              <a href="#!" className="text-blue-600 underline">
                Terms of service
              </a>
            </label>
          </div>

          {error && <div className="text-red-600 text-center">{error}</div>}
          {success && <div className="text-green-600 text-center">{success}</div>}

          <button
            type="submit"
            className="w-full bg-blue-700 text-white font-bold py-3 rounded-xl text-lg hover:bg-blue-800 transition-colors duration-200 shadow-md"
          >
            Register
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm sm:text-base">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-semibold underline">
            Login here
          </a>
        </p>
      </div>
    </section>
  );
};

export default SignUp;
