import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "supersecretkey";


const users = [{ id: 1, username: "admin", password: "password" }];


router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    return res.status(401).json({ ok: false, error: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user.id, username: user.username }, SECRET, {
    expiresIn: "1h",
  });
  res.json({ ok: true, token });
});

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ ok: false, error: "No token" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ ok: false, error: "No token" });

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ ok: false, error: "Invalid token" });
    req.user = user;
    next();
  });
}

export default router;
