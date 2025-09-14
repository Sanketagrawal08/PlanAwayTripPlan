import express from "express"
import {  acceptInvite, generateTripOverviewController, getHotels, getTripListController, rejectInvite, saveTripController, sendInviteFriends, sosController, viewTrip,  } from "../controllers/tripController.js";
const router = express.Router();
import authMiddleware from "../middleware/auth.middleware.js"

router.post("/overview", generateTripOverviewController);
router.post("/save-trip", authMiddleware , saveTripController)
router.post("/:tripId/invite", authMiddleware, sendInviteFriends)
router.post("/:tripId/accept", authMiddleware, acceptInvite)
router.post("/:tripId/reject", authMiddleware , rejectInvite)
router.get("/view-trip/:tripId", authMiddleware , viewTrip);
router.get("/get-trip-lists", authMiddleware , getTripListController)
router.post("/sos", authMiddleware , sosController)
router.get("/search-hotels", getHotels);

// router.post("/:tripId/update-location", authMiddleware, updateLocation)
// router.post("/confirm-safe", confirmSafe);
// router.post("/:tripId/start", authMiddleware, startTripController);

export default router;