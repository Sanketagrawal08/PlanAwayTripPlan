import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerController = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body)
  if (!name || !email || !password) {
    return res.status(400).send("One field is empty error");
  }

  try {
    const existingUser = await userModel.findOne({ name: name });
    if (existingUser) {
      return res.status(409).send("User alreadyimp exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({ name, email, password: hashedPassword });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id, email: newUser.email }, "snaket", {
      expiresIn: "1d",
    });
     res.cookie("token", token, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production", // prod me true
     secure: true,
    sameSite: "None",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });


    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).send("Server error");
    console.log(error);
  }
};



const loginController = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body)
  const user = await userModel.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  // password match check karo ...
 const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET || "snaket",
    { expiresIn: "1d" }
  );

  // HttpOnly cookie set
  res.cookie("token", token, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production", // prod me true
     secure: true,
    sameSite: "None",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.json({
    message: "Login successful",
    user: { id: user._id, email: user.email },
  });
};

const logoutController = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.json({ message: "Logout successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during logout" });
  }
};

export default { registerController, loginController,logoutController };
