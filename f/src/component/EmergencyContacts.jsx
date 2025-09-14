import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../api";
import AddContactModal from "./AddContactModal";
import { ArrowLeft, Plus, Phone, Mail, User, AlertTriangle } from "lucide-react";
import Loader from  "../component/Loader"
const EmergencyContacts = () => {
  const [allContacts, setAllContacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getContacts = async () => {
      try {
        const res = await api.get("/user/get-contacts");
        if (res.data) setAllContacts(res.data.contacts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getContacts();
  }, []);

  const handleContactAdded = (contact) => {
    setAllContacts([...allContacts, contact]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
           < Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between ">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 bg-gray-200 transition-colors duration-200 p-2 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline ">Back</span>
            </button>

            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold text-red-600 flex items-center justify-center gap-3">
                <AlertTriangle className="w-8 h-8 text-red-500" />
                Emergency Contacts
              </h1>
            </div>

            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>

        {/* Add Contact Button */}
        <div className="mb-8 text-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            Add New Contact
          </button>
        </div>

        {/* Contacts List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {allContacts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Emergency Contacts
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Add trusted contacts who can be reached during emergencies.
                These contacts will receive your SOS messages.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
              >
                Add Your First Contact
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Your Emergency Contacts ({allContacts.length})
                </h2>
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {allContacts.length}/10 contacts
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {allContacts.map((contact, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6"
                  >
                    {/* Contact Header */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {contact.name?.charAt(0)?.toUpperCase() || "C"}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {contact.name}
                        </h3>
                        <p className="text-sm text-red-600 font-medium">
                          Emergency Contact
                        </p>
                      </div>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-700">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Phone className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone Number</p>
                          <p className="font-medium">{contact.number}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-gray-700">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Mail className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email Address</p>
                          <p className="font-medium">{contact.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Info */}
              <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div className="text-sm text-red-800">
                    <p className="font-semibold mb-1">Important:</p>
                    <p>
                      These contacts will receive your location and emergency
                      message when you use the SOS feature. Make sure they are
                      aware and can respond to emergency situations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <AddContactModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onContactAdded={handleContactAdded}
        />
      </div>
    </div>
  );
};

export default EmergencyContacts;
