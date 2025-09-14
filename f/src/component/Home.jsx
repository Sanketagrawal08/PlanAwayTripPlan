import { Calendar, WholeWord } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router";
import pahad3 from "../images/pahad3.jpg";

const Home = () => {
  const navigate = useNavigate();

  const createHandler = () => {
    navigate("/trip-form");
  };

  const viewTripsHandler = () => {
    navigate("/trip-lists");
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${pahad3})` }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/65 bg-opacity-50" />

      {/* Content */}
      <div className="relative max-w-3xl flex flex-col items-center gap-8 text-center text-white">
        {/* Welcome */}
        <h1 className="text-4xl md:text-6xl font-mono">
          Welcome! Ready to plan your next adventure?
        </h1>

        {/* Action Buttons */}
        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={createHandler}
            className=" text-white px-6 py-3 rounded-xl bg-green-900 hover:bg-green-700 transition font-medium"
          >
            Create New Trip
          </button>
          <button
            onClick={viewTripsHandler}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition font-medium"
          >
            My Trips
          </button>
        </div>

        {/* Optional info */}
        <div className="mt-6 text-white/80 text-lg max-w-xl">
          Plan trips, explore destinations, and track your adventures—all in one place.
        </div>
      </div>
    </div>
  );
};

export default Home;
