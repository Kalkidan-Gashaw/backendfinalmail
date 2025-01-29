import jwt from "jsonwebtoken";

export const SECRET_KEY =
  "fdkjkjfdkjfdkjfkjdskjfdskjfkjdskjfdkjsfjkdskj5454gnfdngdf";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    console.log(req.user);
    next();
  } catch (err) {
    res
      .status(401)
      .json({ message: "Invalid or expired token", error: err.message });
  }
};
