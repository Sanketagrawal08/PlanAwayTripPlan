import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import tripRoutes from "./routes/trip.routes.js"
import connecttodb from "./db/db.js";
import cookieparser from "cookie-parser"
import rateLimit from "express-rate-limit"
import dotenv from "dotenv"
dotenv.config()

const app = express();

const apiLimiter = rateLimit({
  windowMs: 15 *60 * 1000, //15min,
  max: 100,
  message:{
    status:429,
    error: "Too many requests, please try again later.",
  },
    standardHeaders: true,    // Return rate limit info in headers
})

// Middleware
app.use(cors({
  origin: ["http://localhost:5173","https://plan-away-trip-plan.vercel.app"],
  credentials: true,              
}));
app.use(cookieparser())
app.use(express.json());

// db
connecttodb();

app.use(apiLimiter);

// routes
app.use("/user", authRoutes);
app.use("/trip", tripRoutes)

export default app;