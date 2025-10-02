import React from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("your-publishable-key-here"); // Replace with your Stripe publishable key

const Payment = ({ shuttle }) => {
  const handleBook = async () => {
    const stripe = await stripePromise;

    // Ideally you call your backend to create a session and get sessionId, but
    // since you have a Payment Link, just open it directly:

    const paymentLink = "https://buy.stripe.com/test_7sY28t91X6gegc8gDwcwg00";

    // Open the payment link in a new tab/window
    window.open(paymentLink, "_blank");
  };

  return (
    <button
      onClick={handleBook}
      className="mt-2 bg-red-600 text-blue-100 px-4 py-2 rounded hover:bg-red-700 transition"
    >
      Book
    </button>
  );
};

export default Payment;
