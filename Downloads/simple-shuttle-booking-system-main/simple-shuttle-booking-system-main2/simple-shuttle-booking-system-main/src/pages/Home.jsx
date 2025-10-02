import React, { useState, useEffect } from 'react';
import img1 from '../components/imgs/picture1.webp';
import img2 from '../components/imgs/picture2.webp';
import img3 from '../components/imgs/picture3.webp';

const images = [img1, img2, img3];

const Home = () => {
  const [current, setCurrent] = useState(0);
  const [error, setError] = useState(false);

  // Auto-slide effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % images.length);
      setError(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, [current, error]);

  const handleError = () => {
    setError(true);
    setCurrent((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 to-blue-200 text-center px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4 tracking-wide drop-shadow-md">
        Welcome to Shuttle Booking System
      </h1>
      <p className="text-lg md:text-xl text-blue-700 font-medium mb-8">
        Book your shuttle easily and manage your trips with convenience.
      </p>

      <div className="w-full max-w-2xl h-80 md:h-96 mb-6 relative overflow-hidden rounded-2xl shadow-lg flex items-center justify-center bg-white">
        <img
          src={images[current]}
          alt={`Shuttle ${current + 1}`}
          className={`w-full h-full object-cover rounded-2xl transition-opacity duration-500 ${error ? 'hidden' : 'block'} shadow-md`}
          onError={handleError}
        />
        {error && (
          <div className="absolute inset-0 bg-white/90 flex items-center justify-center text-red-600 font-bold text-base md:text-lg rounded-2xl">
            Image not found. Showing next image...
          </div>
        )}
      </div>

      <div className="flex justify-center items-center gap-2 mb-8">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 ${
              idx === current
                ? 'bg-blue-700 border-blue-900 shadow-md'
                : 'bg-gray-300 border-blue-100'
            } transition-all duration-300`}
          />
        ))}
      </div>

      <a
        href="/signup"
        className="inline-block mt-10 text-blue-900 font-bold underline text-lg md:text-xl tracking-wide bg-blue-50 px-8 py-3 rounded-lg shadow-md hover:bg-blue-100 transition-colors duration-200"
      >
        Register to book your flight
      </a>
    </div>
  );
};

export default Home;
