import { Router } from "express";
const router = Router();
import authController from "../controllers/authController.js";
import userModel from "../models/user.model.js";
import authMiddleware from "../middleware/auth.middleware.js"
import { getEmergencyContactsController, updateEmergencyContactsController } from "../controllers/tripController.js";
router.post("/register",authController.registerController)
router.post("/login",authController.loginController)
router.post("/logout", authController.logoutController)
router.put("/update-contacts", authMiddleware , updateEmergencyContactsController);
router.get("/get-contacts", authMiddleware , getEmergencyContactsController)

router.get("/me", authMiddleware , async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;