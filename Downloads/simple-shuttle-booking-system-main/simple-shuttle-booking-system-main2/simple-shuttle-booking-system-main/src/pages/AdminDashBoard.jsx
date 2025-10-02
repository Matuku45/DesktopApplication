import React, { useState } from "react";

const dummyShuttles = [
  {
    id: 1,
    route: "Pretoria → Durban",
    date: "2025-10-10",
    time: "14:30",
    duration: "6h",
    pickup: "13:45 - 14:15",
    seats: 12,
    price: 800,
  },
  {
    id: 2,
    route: "Johannesburg → Polokwane",
    date: "2025-10-12",
    time: "09:00",
    duration: "4h",
    pickup: "08:15 - 08:45",
    seats: 8,
    price: 350,
  },
];

const dummyPayments = [
  {
    id: 1,
    passenger: "John Doe",
    shuttle: "Pretoria → Durban",
    amount: 800,
    status: "Paid",
  },
  {
    id: 2,
    passenger: "Jane Smith",
    shuttle: "Johannesburg → Polokwane",
    amount: 350,
    status: "Pending",
  },
];

export default function ShuttleAdminDashboard() {
  const [shuttles, setShuttles] = useState(dummyShuttles);
  const [payments] = useState(dummyPayments);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);
  const [formData, setFormData] = useState({
    route: "",
    date: "",
    time: "",
    duration: "",
    pickup: "",
    seats: "",
    price: "",
  });

  // Add shuttle handler
  const addShuttle = (e) => {
    e.preventDefault();
    setShuttles((prev) => [
      ...prev,
      { ...formData, id: Date.now(), seats: Number(formData.seats), price: Number(formData.price) },
    ]);
    setShowAddModal(false);
    resetForm();
  };

  // Edit shuttle handler
  const editShuttle = (e) => {
    e.preventDefault();
    setShuttles((prev) =>
      prev.map((s) =>
        s.id === showEditModal.id
          ? { ...formData, id: showEditModal.id, seats: Number(formData.seats), price: Number(formData.price) }
          : s
      )
    );
    setShowEditModal(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      route: "",
      date: "",
      time: "",
      duration: "",
      pickup: "",
      seats: "",
      price: "",
    });
  };

  // Delete shuttle
  const deleteShuttle = (id) => {
    if (window.confirm("Are you sure you want to delete this shuttle?")) {
      setShuttles((prev) => prev.filter((s) => s.id !== id));
    }
  };

  // Open edit modal and fill form
  const openEditModal = (shuttle) => {
    setShowEditModal(shuttle);
    setFormData({
      route: shuttle.route,
      date: shuttle.date,
      time: shuttle.time,
      duration: shuttle.duration,
      pickup: shuttle.pickup,
      seats: shuttle.seats,
      price: shuttle.price,
    });
  };

  // Modal component
  const ShuttleModal = ({ title, onClose, onSubmit }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none"
          aria-label="Close modal"
        >
          &times;
        </button>
        <h3 className="text-center text-gray-900 font-semibold text-2xl mb-6">{title}</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          {[
            { label: "Route", name: "route", type: "text", placeholder: "Pretoria → Durban" },
            { label: "Date", name: "date", type: "date" },
            { label: "Time", name: "time", type: "time" },
            { label: "Duration", name: "duration", type: "text", placeholder: "e.g. 6h" },
            { label: "Pickup Window", name: "pickup", type: "text", placeholder: "13:45 - 14:15" },
            { label: "Seats", name: "seats", type: "number", min: 1 },
            { label: "Price (ZAR)", name: "price", type: "number", min: 1 },
          ].map(({ label, name, type, placeholder, min }) => (
            <div key={name} className="flex flex-col">
              <label htmlFor={name} className="font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                id={name}
                type={type}
                required
                min={min}
                placeholder={placeholder}
                value={formData[name]}
                onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          ))}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 w-full text-white font-semibold py-3 rounded-md transition"
          >
            {title.includes("Add") ? "Add Shuttle" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-100 flex flex-col">
        <div className="flex items-center justify-center h-16 border-b border-gray-700">
          <div className="text-2xl font-bold tracking-wide">ShuttleAdmin</div>
        </div>

        <nav className="flex flex-col flex-grow p-4 space-y-3">
          <a
            href="#dashboard"
            className="flex items-center space-x-3 py-2 px-3 rounded hover:bg-gray-800 transition"
          >
            {/* Dashboard Icon */}
            <svg
              className="w-6 h-6 stroke-current"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
            <span>Dashboard</span>
          </a>
          <a
            href="#shuttles"
            className="flex items-center space-x-3 py-2 px-3 rounded hover:bg-gray-800 transition"
          >
            {/* Shuttle Icon */}
            <svg
              className="w-6 h-6 stroke-current"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <circle cx="5.5" cy="17.5" r="2.5" />
              <circle cx="18.5" cy="17.5" r="2.5" />
              <path d="M2 12h20v4H2z" />
              <path d="M2 12l2-6h16l2 6" />
            </svg>
            <span>Shuttles</span>
          </a>
          <a
            href="#payments"
            className="flex items-center space-x-3 py-2 px-3 rounded hover:bg-gray-800 transition"
          >
            {/* Payments Icon */}
            <svg
              className="w-6 h-6 stroke-current"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <rect x="2" y="7" width="20" height="10" rx="2" ry="2" />
              <line x1="2" y1="7" x2="22" y2="7" />
              <line x1="7" y1="7" x2="7" y2="17" />
            </svg>
            <span>Payments</span>
          </a>
        </nav>

        <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Shuttle Admin
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-grow overflow-auto">
        {/* No top header, as requested */}

        {/* Content */}
        <main className="p-6 space-y-6 flex-grow overflow-auto bg-gray-50">
          {/* Shuttle Management */}
          <section
            id="shuttles"
            className="bg-white rounded-lg shadow p-6 max-w-7xl mx-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Shuttle Management
              </h2>
              <button
                onClick={() => {
                  resetForm();
                  setShowAddModal(true);
                }}
                className="bg-blue-600 text-red-500 px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                + Add Shuttle
              </button>
            </div>

            {/* Shuttle list table */}
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="border border-gray-300 px-4 py-2 text-left">Route</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Time</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Pickup Window</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Seats</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Price (ZAR)</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shuttles.length === 0 && (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center text-gray-500 py-4"
                      >
                        No shuttles available.
                      </td>
                    </tr>
                  )}
                  {shuttles.map((shuttle) => (
                    <tr key={shuttle.id} className="even:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{shuttle.route}</td>
                      <td className="border border-gray-300 px-4 py-2">{shuttle.date}</td>
                      <td className="border border-gray-300 px-4 py-2">{shuttle.time}</td>
                      <td className="border border-gray-300 px-4 py-2">{shuttle.duration}</td>
                      <td className="border border-gray-300 px-4 py-2">{shuttle.pickup}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{shuttle.seats}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">R {shuttle.price}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center space-x-2">
                        <button
                          onClick={() => openEditModal(shuttle)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteShuttle(shuttle.id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Payments Tracker Section (optional) */}
          <section
            id="payments"
            className="bg-white rounded-lg shadow p-6 max-w-7xl mx-auto"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Payments Tracker
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="border border-gray-300 px-4 py-2 text-left">Passenger</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Shuttle</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Amount (ZAR)</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center text-gray-500 py-4">
                        No payments recorded.
                      </td>
                    </tr>
                  )}
                  {payments.map((payment) => (
                    <tr key={payment.id} className="even:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{payment.passenger}</td>
                      <td className="border border-gray-300 px-4 py-2">{payment.shuttle}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">R {payment.amount}</td>
                      <td className="border border-gray-300 px-4 py-2">{payment.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {/* Add Shuttle Modal */}
      {showAddModal && (
        <ShuttleModal
          title="Add Shuttle"
          onClose={() => setShowAddModal(false)}
          onSubmit={addShuttle}
        />
      )}

      {/* Edit Shuttle Modal */}
      {showEditModal && (
        <ShuttleModal
          title="Edit Shuttle"
          onClose={() => setShowEditModal(null)}
          onSubmit={editShuttle}
        />
      )}
    </div>
  );
}
