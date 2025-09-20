import express from "express"
import {  acceptInvite, endTrip, generateTripOverviewController,  getHotels, getLocations, getTripListController, rejectInvite, saveTripController, sendInviteFriends, sosController,  startTripController, updateLocationController, viewTrip,  } from "../controllers/tripController.js";
const router = express.Router();
import authMiddleware from "../middleware/auth.middleware.js"
import Location from "../models/location.model.js"

router.post("/overview", generateTripOverviewController);
router.post("/save-trip", authMiddleware , saveTripController)
router.post("/:tripId/invite", authMiddleware, sendInviteFriends)
router.post("/:tripId/accept", authMiddleware, acceptInvite)
router.post("/:tripId/reject", authMiddleware , rejectInvite)
router.get("/view-trip/:tripId", authMiddleware , viewTrip);
router.get("/get-trip-lists", authMiddleware , getTripListController)
router.post("/sos", authMiddleware , sosController)
router.get("/search-hotels", getHotels);
router.post("/:tripId/start" , authMiddleware ,startTripController)
router.post("/tripEnd/:tripId" , authMiddleware , endTrip);


router.post("/location/update", authMiddleware, updateLocationController );
// Get all participant locations for a trip
router.get("/location/:tripId", authMiddleware, getLocations);


export default router;