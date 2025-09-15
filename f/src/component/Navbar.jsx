import React, { useState } from "react";
import useAuthStore from "../store/authStore";
import { NavLink, useNavigate } from "react-router";
import { User, LogOut, Menu, X, Phone, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api.js";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  console.log(user)

  const goToTrips = () => {
    navigate("/trip-lists");
    setIsMobileMenuOpen(false);
  };
  
  const goHome = () => {
    navigate("/home");
    setIsMobileMenuOpen(false);
  };

  const goToProfile = () => {
    navigate("/view-profile");
    setIsMobileMenuOpen(false);
  };

  const goToEmergencyContacts = () => {
    navigate("/emergency-contacts");
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const sosHandler = async () => {
    setIsMobileMenuOpen(false);
    
    const sendSOS = async (location = null) => {
      try {
        const res = await api.post("/trip/sos", { location });
        const { sentContacts, failedContacts } = res.data;

        if (sentContacts?.length)
          toast.success(`SOS sent to: ${sentContacts.join(", ")}`);
        if (failedContacts?.length)
          toast.error(`Failed to send SOS to: ${failedContacts.join(", ")}`);
        if (!sentContacts?.length && !failedContacts?.length)
          toast("SOS processed, but no contacts found.");
      } catch (err) {
        toast.error(err?.response?.data?.message || "Error sending SOS");
      }
    };

    if (!navigator.geolocation) return sendSOS();

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        sendSOS({ latitude, longitude });
      },
      () => {
        sendSOS();
        toast("Could not get location, sending SOS without it.");
      }
    );
  };

  return (
    <nav className="w-full bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={goHome}
            className="text-2xl font-bold text-amber-800 cursor-pointer hover:text-amber-900 transition-colors duration-200 flex items-center"
          >
            <span className="text-3xl mr-1">⛰️</span>
            Plan<span className="text-emerald-600">Away</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Navigation Links */}
            <div className="flex items-center space-x-4">
              
              <button
                onClick={goToEmergencyContacts}
                className="flex items-center gap-2  bg-green-600 text-white p-2 rounded font-medium transition-colors duration-200"
              >
                <Phone className="w-4 h-4" />
                Emergency Contacts
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={sosHandler}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200 shadow-md"
              >
                <AlertTriangle className="w-4 h-4" />
                SOS
              </button>


              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
              {/* User Profile */}
              <div
                onClick={goToProfile}
                className="flex cursor-pointer items-center gap-3 bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white font-medium px-4 py-2 rounded-full shadow-md transition-all"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
               <div>
                 <span className="hidden lg:block">Hello, {user?.name || "User"}</span>
               </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-amber-800 p-2 rounded-lg transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="py-4 space-y-3 border-t border-gray-100">
            {/* User Profile Mobile */}
            <div
              onClick={goToProfile}
              className="flex cursor-pointer items-center gap-3 p-3 bg-gradient-to-r from-gray-800 to-gray-700 text-white font-medium rounded-lg shadow-md"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <p className="font-semibold">Hello, {user?.name || "User"}</p>
               
                <p className="text-sm text-gray-300">View Profile</p>
              </div>
            </div>

            {/* Navigation Links Mobile */}
            <button
              onClick={goToTrips}
              className="w-full text-left p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 font-medium"
            >
              My Trips
            </button>

            <button
              onClick={goToEmergencyContacts}
              className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 font-medium"
            >
              <Phone className="w-5 h-5" />
              Emergency Contacts
            </button>

            {/* Action Buttons Mobile */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <button
                onClick={sosHandler}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 shadow-md"
              >
                <AlertTriangle className="w-5 h-5" />
                Emergency SOS
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg transition-colors duration-200 shadow-md"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;