import React, { useEffect, useState } from "react";
import api from "../api";
import { CalendarDays, ArrowRight, ArrowLeft, MapPin, Users, Clock, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../component/Loader";

const TripList = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getTripList();
  }, []);
console.log(trips)
  const getTripList = async () => {
    try {
      const res = await api.get("/trip/get-trip-lists");
      setTrips(res.data || []);
      
    } catch (error) {
      console.log("Error fetching trips:", error);
      toast.error("Failed to fetch trips");
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  // console.table(trips)

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="min-h-screen bg-gray-300">
      <div className="relative max-w-6xl mx-auto p-4 lg:p-6">

        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 mb-8 border border-white/20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/home")}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back</span>
              </button>

              <div className="h-8 w-px bg-gray-300 mx-2" />

              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-800">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                    <CalendarDays className="w-6 h-6 text-white" />
                  </div>
                  My Adventures
                </h1>
                <p className="text-gray-600 mt-1">Explore your travel journey</p>
              </div>
            </div>

            <button
              onClick={() => navigate("/trip-form")}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              New Trip
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
              <Loader />
              <p className="text-gray-600 text-center mt-4">Loading your adventures...</p>
            </div>
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-12 max-w-md mx-auto border border-white/20">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">No Adventures Yet</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Start planning your next amazing journey! Create your first trip and begin exploring the world.
              </p>
              <button
                onClick={() => navigate("/trip-form")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Plan Your First Trip
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-6">
            {trips.map((trip, index) => (
              <div
              key={trip._id}
              className="flex-1 min-w-[300px] max-w-sm bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden border border-white/20 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl"
              style={{ animationDelay: `${index * 100}ms` }}
              >
              
                {/* Trip Header */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-700 p-6 text-white">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold line-clamp-2 flex-1 pr-2">
                      {trip?.title || "Untitled Trip"}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 text-blue-100">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Created {formatDate(trip.createdAt)}</span>
                  </div>
                </div>

                {/* Trip Content */}
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPin className="w-5 h-5 text-blue-500" />
                      <span className="text-sm">{trip.destination || "Destination not set"}</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600">
                      <Users className="w-5 h-5 text-green-500" />
                      <span className="text-sm">{trip.participants.length || 0} participants</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => navigate(`/trip/${trip._id}`)}
                    className="w-full bg-gradient-to-r from-gray-600 to-gray-700 cursor-pointer text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-lg"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        
      </div>
    </div>
  );
};

export default TripList;
