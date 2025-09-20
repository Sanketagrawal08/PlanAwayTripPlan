// models/Location.js
import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Location", LocationSchema);
