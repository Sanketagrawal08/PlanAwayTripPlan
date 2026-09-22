import app from "./src/app.js";
import mongoose from "mongoose";
import http from "http";
import locationModel from "./src/models/location.model.js";
import TripModel from "./src/models/trip.model.js";
import { Server } from "socket.io";

const PORT = 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: ["http://localhost:5173","https://plan-away-trip-plan.vercel.app"],methods: ["GET", "POST"], credentials:true },
});

const tripSockets = {};

io.on("connection", (socket) => {

  socket.on("joinTrip", async ({ tripId, userId, username }) => {

    if (!userId || !tripId) return;
    socket.join(tripId);
    tripSockets[userId] = socket.id;

    try {
      const trip = await TripModel.findById(tripId).populate("participants");
      if (!trip) return;

      const currentLocations = await Promise.all(
        trip.participants.map(async (user) => {
          let loc = await locationModel.findOne({ tripId, userId: user._id });
          if (!loc) {
            loc = new locationModel({
              tripId,
              userId: user._id,
              username: user.name,
              latitude: null,
              longitude: null,
            });
            await loc.save();
           
          }
          return loc;
        })
      );

      io.to(socket.id).emit("allLocations", currentLocations);
    } catch (err) {
      console.error("[Backend] Error in joinTrip:", err);
    }
  });

  socket.on("updateLocation", async ({ tripId, userId, latitude, longitude, username }) => {

    try {
      let loc = await locationModel.findOne({ userId, tripId });
      if (!loc) {
        loc = new locationModel({ userId, tripId, username, latitude, longitude });
      } else {
        loc.latitude = latitude;
        loc.longitude = longitude;
        loc.updatedAt = new Date();
      }
      await loc.save();

      const allLocations = await locationModel.find({ tripId });
      io.to(tripId).emit("allLocations", allLocations);
    } catch (err) {
      console.error("[Backend] Error in updateLocation:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("[Backend] Socket disconnected:", socket.id);
  });
});


server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);