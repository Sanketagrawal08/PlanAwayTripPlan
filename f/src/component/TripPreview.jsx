import React, { useState } from "react";
import { Navigate, redirect, useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast"
const TripPreview = () => {
  
  const { state } = useLocation();

  const { tripOutline, formData } = state || {};

  const [editedTrip, setEditedTrip] = useState(tripOutline || []);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
 const navigate = useNavigate()

  const handleEditPlace = (dayIndex, timeOfDay, value) => {
    const updated = [...editedTrip];
    updated[dayIndex][timeOfDay].place = value;
    setEditedTrip(updated);
  };

  const saveTrip = async () => {
    setLoading(true);
    try {
        const res = await api.post("/trip/save-trip" , { title: formData?.title || "My Trip",tripOutline: editedTrip , destination: formData.destination})
        
        if(res.status == 201){
        toast.success("✅ Trip Saved")
            navigate("/trip-lists")
        }
    } catch (error) {
        console.log("error in saving trip", error)
       if (error.response?.data?.message === "Already Saved Trip") {
  toast.error("🤔 Trip Already Saved");
} else {
  toast.error("⚠️ Failed to save trip");
}

    } finally{
        setLoading(false)
    }
  };

  const renderPlace = (placeObj, label, dayIndex, timeOfDay) => {
    if (!placeObj) return null;
    return (
      <div className="flex items-center gap-4 my-3 p-4 bg-white rounded-xl shadow hover:shadow-lg transition duration-300">
        <img
          src={placeObj.place_image_url || "https://via.placeholder.com/100x80"}
          alt={placeObj.place}
          className="w-32 h-24 object-cover rounded-lg border border-gray-200 hover:scale-105 transition duration-300"
        />
        <div className="flex flex-col flex-1">
          <p className="text-sm font-semibold text-gray-700">{label}</p>
          {isEditing ? (
            <input
              type="text"
              value={placeObj.place}
              onChange={(e) => handleEditPlace(dayIndex, timeOfDay, e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
            />
          ) : (
            <p className="text-gray-800 font-medium mt-1">{placeObj.place}</p>
          )}
          <p className="text-sm font-medium text-green-600 mt-1">₹{placeObj.ticket_price}</p>
          <p className="text-xs text-gray-500">{placeObj.best_time_to_visit}</p>
        </div>
      </div>
    );
  };

  if (!tripOutline) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
        <p className="text-center text-lg text-gray-600 bg-white p-6 rounded-lg shadow-lg">
          No trip data available.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col items-center p-6">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center tracking-tight">
        Your Dream Trip Preview
      </h2>

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8">
        <div className="space-y-6">
          {editedTrip.map((day, index) => (
            <div
              key={index}
              className="p-6 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-2xl shadow-md"
            >
              <h4 className="text-xl font-bold text-gray-800 mb-4">Day {day.day}</h4>
              {renderPlace(day.morning, "Morning", index, "morning")}
              {renderPlace(day.afternoon, "Afternoon", index, "afternoon")}
              {renderPlace(day.evening, "Evening", index, "evening")}
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col md:flex-row gap-4">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex-1 py-3 rounded-xl text-white font-semibold transition duration-300 ${
              isEditing ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            {isEditing ? "Cancel Editing" : "Modify Trip"}
          </button>

          {isEditing && (
            <button
              onClick={saveTrip}
              disabled={loading}
              className={`flex-1 py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition duration-300 ${
                loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <span>Confirm Save</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripPreview;