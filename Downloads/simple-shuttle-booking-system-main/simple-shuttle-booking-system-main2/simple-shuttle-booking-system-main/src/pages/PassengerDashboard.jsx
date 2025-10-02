import React, { useState, useEffect } from "react";
import Payment from "../components/payment";


const PassengerDashboard = () => {
  const [user, setUser] = useState({ name: "", email: "" });
  const [selectedShuttle, setSelectedShuttle] = useState(null);
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [search, setSearch] = useState({ date: "", seats: 1, origin: "", destination: "" });
  const [paidBookings, setPaidBookings] = useState([]);
  const [countdowns, setCountdowns] = useState({});

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) setUser({ name: loggedInUser.name, email: loggedInUser.email });
  }, []);

  const dummyShuttles = [
    { id: 1, route: "Johannesburg → Polokwane", date: "2025-10-05", time: "05:30", duration: "6.5 hrs", pickup: "10 min", seats: 10, price: 350 },
    { id: 2, route: "Pretoria → Durban", date: "2025-10-05", time: "08:00", duration: "3.2 hrs", pickup: "15 min", seats: 4, price: 400 },
    { id: 3, route: "Johannesburg → Bloemfontein", date: "2025-10-05", time: "12:30", duration: "1.1 hrs", pickup: "20 min", seats: 2, price: 280 },
    { id: 4, route: "Johannesburg → Polokwane", date: "2025-10-05", time: "15:45", duration: "5.5 hrs", pickup: "10 min", seats: 18, price: 520 }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdowns = {};
      dummyShuttles.forEach(shuttle => {
        const shuttleDate = new Date(`${shuttle.date}T${shuttle.time}:00`);
        const diff = shuttleDate - new Date();
        if (diff > 0) {
          const hours = Math.floor(diff / 1000 / 3600);
          const minutes = Math.floor((diff / 1000 % 3600) / 60);
          const seconds = Math.floor(diff / 1000 % 60);
          newCountdowns[shuttle.id] = `${hours}h ${minutes}m ${seconds}s`;
        } else {
          newCountdowns[shuttle.id] = "Departed";
        }
      });
      setCountdowns(newCountdowns);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleBook = (shuttle) => {
    setSelectedShuttle(shuttle);
    setSeatsToBook(1);
    setBookingSuccess("");
  };

  const handleConfirmBooking = () => {
    if (seatsToBook < 1 || seatsToBook > selectedShuttle.seats) {
      setBookingSuccess("Invalid number of seats.");
      return;
    }
    const booking = { ...selectedShuttle, seatsBooked: seatsToBook, paid: true };
    setPaidBookings([...paidBookings, booking]);
    setBookingSuccess(`Booking confirmed for ${seatsToBook} seat(s) on ${selectedShuttle.route} (${selectedShuttle.time}, ${selectedShuttle.date}).`);
    setSelectedShuttle(null);
  };

  const filteredShuttles = dummyShuttles.filter((s) =>
    (!search.origin || s.route.toLowerCase().includes(search.origin.toLowerCase())) &&
    (!search.destination || s.route.toLowerCase().includes(search.destination.toLowerCase())) &&
    (!search.date || s.date === search.date)
  );

return (
  <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
    {/* Sidebar */}
    <aside className="w-64 bg-gray-900 text-gray-100 flex flex-col">
      <div className="flex items-center justify-center h-16 border-b border-gray-700">
        <div className="text-2xl font-bold tracking-wide">MetroShuttle</div>
      </div>
      <nav className="flex flex-col flex-grow p-4 space-y-3">
        <span className="text-sm text-gray-400">Welcome</span>
        <div className="text-white font-bold">{user.name || "Passenger"}</div>
        <a href="#" className="py-2 px-3 rounded hover:bg-gray-800 transition">Dashboard</a>
        <a href="#" className="py-2 px-3 rounded hover:bg-gray-800 transition">Bookings</a>
        <a href="#" className="py-2 px-3 rounded hover:bg-gray-800 transition">Profile</a>
        <a href="#" className="py-2 px-3 rounded hover:bg-gray-800 transition">Support</a>
        <a href="#" className="py-2 px-3 rounded bg-red-600 hover:bg-red-700 transition text-white font-semibold">Logout</a>
      </nav>
      <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
        &copy; {new Date().getFullYear()} MetroShuttle
      </div>
    </aside>

    {/* Main Content */}
    <div className="flex flex-col flex-grow overflow-auto">
      <main className="p-6 space-y-6 flex-grow overflow-auto bg-gray-50">
        {/* Search Section */}
        <section className="bg-white rounded-lg shadow p-6 max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Find a Shuttle</h2>
          <div className="flex flex-wrap gap-4">
            <input
              type="date"
              value={search.date}
              onChange={(e) => setSearch({ ...search, date: e.target.value })}
              className="flex-1 min-w-[150px] p-2 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              min={1}
              value={search.seats}
              onChange={(e) => setSearch({ ...search, seats: Number(e.target.value) })}
              className="flex-1 min-w-[100px] p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Origin"
              value={search.origin}
              onChange={(e) => setSearch({ ...search, origin: e.target.value })}
              className="flex-1 min-w-[150px] p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Destination"
              value={search.destination}
              onChange={(e) => setSearch({ ...search, destination: e.target.value })}
              className="flex-1 min-w-[150px] p-2 border border-gray-300 rounded-md"
            />
           <button className="bg-red-600 text-blue-700 px-4 py-2 rounded hover:bg-red-700 transition">
  Search
</button>

          </div>
        </section>

     {/* Shuttle List */}
<section className="bg-white rounded-lg shadow p-6 max-w-7xl mx-auto">
  <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Shuttles</h2>
  {filteredShuttles.length === 0 && <p className="text-gray-500">No shuttles match your search.</p>}
  {filteredShuttles.map((shuttle) => (
    <div
      key={shuttle.id}
      className="border border-gray-200 rounded-md p-4 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center"
    >
      <div>
        <div className="text-blue-700 font-semibold">{shuttle.route}</div>
        <div className="text-sm text-gray-600">{shuttle.date} • {shuttle.time} • {shuttle.duration}</div>
        <div className="text-sm text-gray-600">Pickup: {shuttle.pickup} • Seats: {shuttle.seats}</div>
        <div className="text-sm text-red-500">Departure in: {countdowns[shuttle.id]}</div>
      </div>
      <div className="text-right mt-2 sm:mt-0">
        <div className="text-green-600 font-bold text-lg">ZAR {shuttle.price}</div>
        <Payment shuttle={shuttle} />
      </div>
    </div>
  ))}
</section>

        {/* Confirm Booking Modal */}
        {selectedShuttle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
              <button
                onClick={() => setSelectedShuttle(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none"
              >
                &times;
              </button>
              <h3 className="text-lg font-semibold mb-4">Confirm Booking</h3>
              <p className="mb-2">
                <strong>Route:</strong> {selectedShuttle.route}
              </p>
              <p className="mb-2">
                <strong>Date:</strong> {selectedShuttle.date} • <strong>Time:</strong> {selectedShuttle.time}
              </p>
              <label className="block mt-4 mb-2 font-medium">Seats to book:</label>
              <input
                type="number"
                min={1}
                max={selectedShuttle.seats}
                value={seatsToBook}
                onChange={(e) => setSeatsToBook(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <button
                onClick={handleConfirmBooking}
                className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
              >
                Confirm
              </button>
              {bookingSuccess && <p className="text-green-600 mt-4">{bookingSuccess}</p>}
            </div>
          </div>
        )}

        {/* Paid Bookings */}
        {paidBookings.length > 0 && (
          <section className="bg-white rounded-lg shadow p-6 max-w-7xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Bookings</h2>
            {paidBookings.map((b, i) => (
              <div key={i} className="border border-gray-200 rounded-md p-4 mb-3">
                <div className="text-blue-700 font-semibold">{b.route}</div>
                <div className="text-sm text-gray-600">{b.date} • {b.time} • {b.duration}</div>
                <div className="text-sm">Seats booked: {b.seatsBooked}</div>
                <div className="text-green-600 font-bold mt-1">Total Paid: ZAR {b.price * b.seatsBooked}</div>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  </div>
);

}


export default PassengerDashboard;
