import dotenv from "dotenv"
dotenv.config()
// import cohere from "../services/cohereclient.js";
import { jsonrepair } from "jsonrepair";
import axios from "axios";
import TripModel from "../models/trip.model.js";
import UserModel from "../models/user.model.js";
import userModel from "../models/user.model.js";
import sendEmail from "../utils/sendEmail.js";
const UNSPLASH_KEY = "A37NTQMDIgFMWbq5kq1uEslTH8hWwVnDSi4ZYfKTdJE";
const FALLBACK_IMAGE = "https://via.placeholder.com/400x300?text=No+Image";
import {GoogleGenerativeAI} from "@google/generative-ai"
const GEMINI_API = process.env.GEMINI_API;
if (!GEMINI_API) throw new Error("GEMINI_API is not set in .env");
const genAi = new GoogleGenerativeAI(GEMINI_API);
// Function to fetch Unsplash image for a place
async function fetchPlacePhoto(placeName) {
  try {
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: { query: placeName, client_id: UNSPLASH_KEY, per_page: 1 },
    });
    return response.data.results?.[0]?.urls?.regular || FALLBACK_IMAGE;
  } catch (err) {
    console.error("🖼️ Unsplash Error:", err.message);
    return FALLBACK_IMAGE;
  }
}

export const generateTripOverviewController = async (req, res) => {
  const { title, country, destination, budget, travellers, days } = req.body;

  const prompt = `
You are a travel assistant. Generate a ${days}-day trip plan for ${destination}, ${country}.
Budget: INR ${budget}.
Travellers: ${travellers}.

Return the result STRICTLY in this JSON format:
{
  "trip_outline": [
    {
      "day": 1,
      "morning": { "place": "Place Name", "best_time_to_visit": "09:00–12:00" },
      "afternoon": { "place": "Place Name", "best_time_to_visit": "12:00–16:00" },
      "evening": { "place": "Place Name", "best_time_to_visit": "16:00–20:00" }
    }
  ]
}

Rules:
- Only valid JSON, no markdown, no extra text.
- Each day must have morning, afternoon, evening keys.
- Include  best_time_to_visit (string).
- trip_outline must have exactly ${days} entries.
`;

  try {
    // 1️⃣ Get Gemini model
    const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 2️⃣ Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();

    let tripData;

    // 3️⃣ Parse JSON safely
    try {
      tripData = JSON.parse(rawText);
    } catch (err) {
      console.warn("⚠️ JSON parse failed, attempting jsonrepair...");
      try {
        tripData = JSON.parse(jsonrepair(rawText));
      } catch (err2) {
        console.error("❌ JSON repair failed:", err2.message);
        return res.status(500).json({ error: "AI JSON response invalid" });
      }
    }

    // 4️⃣ Fetch images for all places
    for (let i = 0; i < tripData.trip_outline.length; i++) {
      const day = tripData.trip_outline[i];
      const times = ["morning", "afternoon", "evening"];
      for (let j = 0; j < times.length; j++) {
        const time = times[j];
        const place = day[time];

        if (place && place.place) {
          place.place_image_url = await fetchPlacePhoto(place.place);
        } else {
          place.place_image_url = FALLBACK_IMAGE;
        }
      }
    }

    // 5️⃣ Send response
    res.json({ overview: tripData });
  } catch (err) {
    console.error("❌ Gemini API Error:", err);
    res.status(500).json({ error: "Failed to generate trip overview" });
  }
};

export const saveTripController = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const { title, tripOutline,destination } = req.body;
    
    const tripExist = await  TripModel.findOne({title , owner:userId})
    if(tripExist) res.status(400).json({message:"Already Saved Trip"});    

    if (!tripOutline) {
      return res.status(400).json({ message: "tripOutline is required" });
    }
    const trip = new TripModel({
      title,
      owner: userId,
      tripOutline,
      destination:destination
    });
    
    await trip.save();
    return res.status(201).json({ message: "Trip saved successfully", trip });
  } catch (error) {
    console.error("Error saving trip:", error);
    return res.status(500).json({ message: "Server error", error: error });
  }
};

export const sosController = async (req, res) => {
  try {
    // 1️⃣ User ID get karna
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // 2️⃣ User fetch karna
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 3️⃣ Emergency contacts check
    if (!user.emergencyContacts?.length) {
      return res.status(400).json({ message: "No emergency contacts set" });
    }

    // 4️⃣ Location handle karna
    const { location } = req.body;
    const locationHtml =
      location?.latitude && location?.longitude
        ? `<p>Last known location:</p>
         <ul>
           <li>Latitude: ${location.latitude}</li>
           <li>Longitude: ${location.longitude}</li>
           <li><a href="https://www.google.com/maps?q=${location.latitude},${location.longitude}" target="_blank">View on Google Maps</a></li>
         </ul>`
        : "<p>Location not available.</p>";

    // 5️⃣ Email content
    const subject = "🚨 SOS Alert";
    const html = `
      <h2>SOS Alert for ${user.name}</h2>
      <p>${user.name} has triggered an SOS alert and may need immediate help.</p>
      ${locationHtml}
      <p>Please try to contact them as soon as possible.</p>
    `;

    // 6️⃣ Send emails in parallel
    const emailResults = await Promise.allSettled(
      user.emergencyContacts
        .filter((c) => c.email)
        .map((c) => sendEmail(c.email, subject, html))
    );

    // 7️⃣ Separate sent and failed contacts
    const sentContacts = [];
    const failedContacts = [];

    emailResults.forEach((result, i) => {
      const contact = user.emergencyContacts[i];
      if (result.status === "fulfilled")
        sentContacts.push(contact.name || contact.email);
      else failedContacts.push(contact.name || contact.email);
    });

    // 8️⃣ Response with names
    res.status(200).json({
      message: "SOS emails processed 🚨",
      sentContacts,
      failedContacts,
    });
  } catch (error) {
    console.error("Error in sosController:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateEmergencyContactsController = async (req, res) => {
  const { contact } = req.body;

  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.emergencyContacts.push(contact);
    await user.save();

    res.json({
      msg: "Emergency contacts updated",
      contacts: user.emergencyContacts,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

export const getEmergencyContactsController = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.status(200).json({
      msg: "contacts",
      contacts: Array.isArray(user.emergencyContacts)
        ? user.emergencyContacts
        : [],
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Server error in getemergency", error: error.message });
  }
};

// Invite a friend
export const sendInviteFriends = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { email } = req.body;
    const userId = req.user.id;

    const trip = await TripModel.findById(tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    // Only owner can invite
    if (!trip.owner || trip.owner.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only owner can invite friends" });
    }

    const friend = await UserModel.findOne({ email });
    if (!friend)
      return res
        .status(400)
        .json({ message: "User not registered. Ask them to sign up first." });

    if (
      trip.invites?.some((id) => id.toString() === friend._id.toString()) ||
      trip.participants?.some((id) => id.toString() === friend._id.toString())
    ) {
      return res
        .status(400)
        .json({ message: "Already invited or participant" });
    }

    trip.invites.push(friend._id);
    await trip.save();

    res.json({ message: "Invite sent successfully", trip });
  } catch (err) {
    console.error("Error in invitefriend", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Accept invite
export const acceptInvite = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;

    const trip = await TripModel.findById(tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    if (!trip.invites?.some((id) => id.toString() === userId.toString())) {
      return res.status(400).json({ message: "No pending invite found" });
    }

    trip.invites = trip.invites.filter(
      (id) => id.toString() !== userId.toString()
    );

    if (!trip.participants?.some((id) => id.toString() === userId.toString())) {
      trip.participants.push(userId);
    }

    await trip.save();
    res.json({ message: "Invite accepted", trip });
  } catch (err) {
    console.error("Error accepting invite:", err);
    res.status(500).json({ message: "Server error in acceptinvite" });
  }
};

// Reject invite
export const rejectInvite = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;

    const trip = await TripModel.findById(tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    trip.invites = trip.invites.filter(
      (id) => id.toString() !== userId.toString()
    );
    await trip.save();

    res.json({ message: "Invite rejected", trip });
  } catch (err) {
    console.error("Error rejecting invite:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTripListController = async (req, res) => {
  try {
    // support both req.user.id or req.user._id depending on your auth middleware
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Find trips where user is owner OR participant OR invited
    const trips = await TripModel.find({
      $or: [{ owner: userId }, { participants: userId }, { invites: userId }],
    })
      .populate("owner", "name email")
      .populate("participants", "name email")
      .populate("invites", "name email");

    // Attach userRole and isUserInvited to each trip
    const tripsWithRole = trips.map((trip) => {
      const obj = trip.toObject();

      let role = "viewer";
      if (trip.owner && trip.owner._id.toString() === userId.toString()) {
        role = "owner";
      } else if (
        Array.isArray(trip.participants) &&
        trip.participants.some((p) => p._id.toString() === userId.toString())
      ) {
        role = "participant";
      } else if (
        Array.isArray(trip.invites) &&
        trip.invites.some((i) => i._id.toString() === userId.toString())
      ) {
        role = "invited";
      }

      obj.userRole = role;
      obj.isUserInvited = role === "invited";
      return obj;
    });

    return res.status(200).json(tripsWithRole);
  } catch (err) {
    console.error("Error in getTripListController:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


export const viewTrip = async (req, res) => {
  const { tripId } = req.params;
  const userId = req.user?.id || req.user?._id;

  try {
    const trip = await TripModel.findById(tripId)
      .populate("owner", "name email")
      .populate("participants", "name email")
      .populate("invites", "name email");

    if (!trip) return res.status(404).json({ message: "Trip not found" });

    // Optional: check if user has access to this trip
    const hasAccess =
      trip.owner?._id?.toString() === userId?.toString() ||
      trip.participants?.some((p) => p._id.toString() === userId?.toString()) ||
      trip.invites?.some((i) => i._id.toString() === userId?.toString());

    if (!hasAccess) {
      return res
        .status(403)
        .json({ message: "Forbidden: No access to this trip" });
    }

    // attach role like in list
    let role = "viewer";
    if (trip.owner?._id?.toString() === userId?.toString()) {
      role = "owner";
    } else if (
      trip.participants?.some((p) => p._id.toString() === userId?.toString())
    ) {
      role = "participant";
    } else if (
      trip.invites?.some((i) => i._id.toString() === userId?.toString())
    ) {
      role = "invited";
    }

    const tripWithRole = {
      ...trip.toObject(),
      userRole: role,
      isUserInvited: role === "invited",
    };

    res.status(200).json(tripWithRole);
  } catch (error) {
    console.error("Error in viewTripController:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getHotels = async (req, res) => {

  try {
    const {
      dest_id,
      adults,
      children_age,
      room_qty,
      page_number,
      currency_code,
      location,
      arrival_date,
      departure_date,
    } = req.query;
    // console.log(req.query)
    const options = {
      method: "GET",
      url: "https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels",
      params: {
        dest_id,
        search_type: "CITY",
        adults,
        children_age,
        room_qty,
        page_number,
        units: "metric",
        temperature_unit: "c",
        languagecode: "en-us",
        currency_code,
        location,
        arrival_date,
        departure_date,
      },
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY, // keep key secret in .env
        "x-rapidapi-host": "booking-com15.p.rapidapi.com",
      },
    };
    

    const response = await axios.request(options);
    res.status(200).json({ hotels: response.data });
  } catch (error) {
    console.error("Error fetching hotels:", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch hotels", error: error.message });
  }
};


export const startTripController = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id || req.user._id;

    const trip = await TripModel.findById(tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    // Only owner can start trip
    if (trip.owner.toString() !== userId) {
      return res.status(403).json({ message: "Only owner can start the trip" });
    }

    trip.started = true; // You can track trip status
    trip.startTime = new Date();

    await trip.save();

    res.json({ message: "Trip started successfully", trip });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error in startTripController" });
  }
};