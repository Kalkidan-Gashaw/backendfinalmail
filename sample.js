import jwt from "jsonwebtoken";

const payload = {
  id: 123,
  username: "johndoe",
  role: "admin",
};

const secret = "dsknfdsfkjldskjlfkjldjkll@450p5409df"; // Keep this safe
const options = { expiresIn: "1h" }; // Token validity: 1 hour

const token = jwt.sign(payload, secret, options);

console.log("Generated JWT:", token);
const decoded = jwt.decode(token);
console.log("Decoded payload:", decoded);
