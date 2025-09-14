import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import tripRoutes from "./routes/trip.routes.js"
import connecttodb from "./db/db.js";
import cookieparser from "cookie-parser"
const app = express();

// Middleware
app.use(cors({
  origin: ["http://localhost:5173","https://plan-away-trip-plan.vercel.app"],
  credentials: true,              
}));
app.use(cookieparser())
app.use(express.json());

// db
connecttodb();

// routes
app.use("/user", authRoutes);
app.use("/trip", tripRoutes)

export default app;