import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  place: { type: String, required: true },
  ticket_price: { type: Number, default: 0 },
  best_time_to_visit: { type: String },
  place_image_url: { type: String },
});

const daySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  morning: { type: activitySchema },
  afternoon: { type: activitySchema },
  evening: { type: activitySchema },
});

// const locationSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   coordinates: {
//     lat: { type: Number, required: true },
//     lng: { type: Number, required: true },
//   },
//   lastUpdated:{type:Date , default:Date.now()}
// });

// const safetyCheckSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   createdAt: { type: Date, default: Date.now },
//   confirmed: { type: Boolean, default: false },
//   confirmedAt:{type:Date}
// });

const tripSchema = new mongoose.Schema({
  title: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  tripOutline: [daySchema],
  destination: {type:String},
  createdAt: { type: Date, default: Date.now },
  currentStatus: {
    type: String,
    enum: ["PENDING", "STARTED", "ENDED"],
    default: "PENDING",
  },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  invites: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  started:{type:Boolean , default:false},
  startTime: { type: Date }
});

const TripModel = mongoose.model("Trip", tripSchema);

export default TripModel;
