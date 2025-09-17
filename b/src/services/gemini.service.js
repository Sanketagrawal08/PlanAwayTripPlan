// import dotenv from "dotenv";
// dotenv.config();

// import { GoogleGenerativeAI } from "@google/generative-ai";

// // Get the API key from the environment variable
// const GEMINI_API_KEY =
//   process.env.GEMINI_API_KEY;

// // Check if the API key is loaded correctly
// if (!GEMINI_API_KEY) {
//   throw new Error("GEMINI_API_KEY is not set in your .env file.");
// }

// // Pass the API key to the constructor
// const genAi = new GoogleGenerativeAI(GEMINI_API_KEY);

// async function main() {
//   try {
//     // Get the model
//     const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });

//     // Make the API call
//     const result = await model.generateContent(`
// You are an expert travel planner. Generate a realistic 4-day trip plan for jaipur, india.

// Inputs:
// - Starting destination: Delhi
// - Number of travellers: 2
// - Total budget (INR): 10000

// Requirements:
// 1. Output a JSON ONLY, no markdown, no extra text.
// 2. Structure:
// {
//   "trip_outline": [
//     {
//       "day": 1,
//       "morning": { "place": "Place Name", "ticket_price": 200, "best_time_to_visit": "09:00–12:00",  },
//       "afternoon": { "place": "Place Name", "ticket_price": 300, "best_time_to_visit": "12:00–16:00", },
//       "evening": { "place": "Place Name", "ticket_price": 100, "best_time_to_visit": "16:00–20:00",  }
//     }
//   ],
//   "total_estimated_cost": 0
// }

// 3. Rules:
// - Each day must have morning, afternoon, evening slots.
// - Include ticket_price (integer), best_time_to_visit (string), and travel_time_from_previous (minutes).
// - Respect total budget; cumulative ticket prices must not exceed budget.
// - Travel time should be realistic based on previous location.
// - Assign activities logically: morning = sightseeing, afternoon = main attractions, evening = relaxed or scenic.
// - trip_outline must have exactly 4 entries.
// - Provide total_estimated_cost at the end.

// 4. Optional: If a place cannot be visited due to budget or time constraints, replace it with a budget-friendly alternative.

// Generate the trip now.
// `);
//     const response = await result.response;
//     const text = response.text();
//     console.log(text);
//   } catch (error) {
//     console.log("An error occurred:", error);
//   }
// }

// main();
