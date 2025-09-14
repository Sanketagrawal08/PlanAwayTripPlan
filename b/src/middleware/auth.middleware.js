import jwt  from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }
  try {
    const secret = process.env.JWT_SECRET || "snaket";
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token." });
  }
};
export default authMiddleware;