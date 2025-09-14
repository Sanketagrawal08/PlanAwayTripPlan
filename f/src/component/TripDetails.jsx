import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { UserPlus, ArrowLeft, Users, CalendarDays, Clock, MapPin, Star, Heart } from "lucide-react";
import toast from "react-hot-toast";

const TripDetails = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");

  useEffect(() => {
    fetchTrip();
  }, [tripId]);

  const fetchTrip = async () => {
    try {
      const res = await api.get(`/trip/view-trip/${tripId}`);
      setTrip(res.data);
    } catch (err) {
      console.error("Error fetching trip:", err);
      toast.error("Failed to load trip");
    } finally {
      setLoading(false);
    }
  };

  const sendInvite = async () => {
    if (!inviteEmail) return toast.error("Enter a valid email!");
    try {
      await api.post(`/trip/${tripId}/invite`, { email: inviteEmail });
      toast.success("Invite Sent ✅");
      setInviteEmail("");
      fetchTrip();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending invite ❌");
    }
  };

  const respondInvite = async (action) => {
    try {
      await api.post(`/trip/${tripId}/${action}`);
      toast.success(`Invite ${action === "accept" ? "Accepted 🎉" : "Rejected 🚫"}`);
      fetchTrip();
    } catch (err) {
      toast.error("Error responding to invite ❌");
    }
  };

  const startTrip = async () => {
    toast.success("Trip started 🚀");
    // optionally call backend
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 font-medium">Loading your amazing trip...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-3xl shadow-xl">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-2xl text-red-600 font-bold mb-2">Oops! Trip not found</p>
          <p className="text-gray-600">The trip you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-slate-700 hover:text-blue-600 mb-8 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
        >
          <ArrowLeft className="w-5 h-5" /> 
          <span className="font-medium">Back to Trips</span>
        </button>

        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-8 rounded-3xl shadow-2xl mb-10">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Your Dream Trip Awaits
                </h1>
                <div className="flex flex-col sm:flex-row gap-4 text-white/90">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-white/80" />
                    <span>Created {new Date(trip.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-white/80" />
                    <span className="capitalize font-semibold">{trip.userRole}</span>
                  </div>
                </div>
              </div>
              <div className="text-6xl opacity-20 lg:opacity-30">✈️</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="flex-1 space-y-8">
            {/* Participants Section */}
            <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-full">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Trip Companions</h3>
              </div>
              
              {trip.participants?.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {trip.participants.map((p) => (
                    <div
                      key={p._id}
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-lg">{p.name}</p>
                        <p className="text-gray-600">{p.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">👥</div>
                  <p className="text-gray-500 text-lg">No companions yet - invite some friends!</p>
                </div>
              )}
            </section>

            {/* Pending Invites */}
            {trip.invites?.length > 0 && (
              <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-amber-100 rounded-full">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Pending Invites</h3>
                </div>
                
                <div className="flex flex-col gap-4">
                  {trip.invites.map((i) => (
                    <div
                      key={i._id}
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-100 rounded-2xl shadow-sm"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {i.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-lg">{i.name}</p>
                        <p className="text-gray-600">{i.email}</p>
                        <p className="text-amber-600 text-sm font-medium">⏳ Awaiting response</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Actions */}
          <div className="lg:w-80 space-y-6">
            {/* Invite Friend */}
            {trip.userRole === "owner" && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
                <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  
                    <UserPlus className="w-5 h-5 text-green-600" />
                  
                  Invite Friends
                </h4>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="friend@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                  />
                  <button
                    onClick={sendInvite}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                  >
                    <UserPlus className="w-5 h-5" /> Send Invite
                  </button>
                </div>
              </div>
            )}

            {/* Accept/Reject Buttons */}
            {trip.userRole === "invited" && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
                <h4 className="text-xl font-bold text-gray-800 mb-4">Respond to Invite</h4>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => respondInvite("accept")}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                  >
                    <Heart className="w-5 h-5" /> Accept Invite
                  </button>
                  <button
                    onClick={() => respondInvite("reject")}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-2xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                  >
                    Decline
                  </button>
                </div>
              </div>
            )}

            {/* Start Trip */}
            {trip.userRole === "owner" && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
                <button
                  onClick={startTrip}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl font-bold text-lg"
                >
                  <span className="text-2xl">🚀</span>
                  Start Your Adventure
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Trip Outline */}
        <section className="mt-12">
          <div className="text-center mb-10">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">Your Trip Journey</h3>
            <p className="text-xl text-gray-600">Explore amazing places day by day</p>
          </div>
          
          {trip.tripOutline?.length > 0 ? (
            <div className="flex flex-col gap-8">
              {trip.tripOutline.map((day) => (
                <div
                  key={day._id}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {day.day}
                    </div>
                    <div>
                      <h4 className="text-3xl font-bold text-gray-800">Day {day.day}</h4>
                      <p className="text-gray-600">Three amazing experiences await</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col lg:flex-row gap-6">
                    {["morning", "afternoon", "evening"].map((time) => (
                      <div
                        key={time}
                        className="flex-1 bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                      >
                        <div className="relative">
                          <img
                            src={day[time].place_image_url}
                            alt={day[time].place}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                            <span className="text-sm font-semibold capitalize text-gray-700">{time}</span>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <h5 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            {day[time].place}
                          </h5>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm">Best time: {day[time].best_time_to_visit}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-amber-500" />
                              <span className="text-lg font-bold text-green-600">₹{day[time].ticket_price}</span>
                              <span className="text-sm text-gray-500">per person</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/20 text-center">
              <div className="text-6xl mb-6">🗺️</div>
              <h4 className="text-2xl font-bold text-gray-800 mb-4">No itinerary yet</h4>
              <p className="text-gray-600 text-lg">Your trip outline will appear here once it's ready</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default TripDetails;