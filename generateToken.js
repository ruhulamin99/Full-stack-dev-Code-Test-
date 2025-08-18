import jwt from "jsonwebtoken";

const SECRET = "super-secret-key";

export function generateToken() {
  return jwt.sign({ user: "backend_test" }, SECRET, { expiresIn: "1h" });
}
