import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./backend.config.js";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(403).json({ message: "Authorization Failed!" });
  }

  //Accessing the token from the authorization header
  const token = authHeader.split(" ")[1];

  try {
    const decodedUser = jwt.verify(token, JWT_SECRET);

    req.userId = decodedUser.userId;

    next();
  } catch (err) {
    return res.status(403).json({
      message: "Something went wrong!",
    });
  }
}
