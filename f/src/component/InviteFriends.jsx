// components/trip/InviteFriends.jsx
import React from "react";
import { UserPlus } from "lucide-react";

const InviteFriends = ({ inviteEmail, setInviteEmail, sendInvite }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
      <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <UserPlus className="w-5 h-5 text-green-600" /> Invite Friends
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
  );
};

export default InviteFriends;
