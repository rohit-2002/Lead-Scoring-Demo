import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecretkey";
const users = [{ id: 1, username: "admin", password: "password" }];

export default async function handler(req, res) {
    // Set CORS headers for all requests
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST for login
    if (req.method !== 'POST') {
        return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }

    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ ok: false, error: 'Username and password required' });
        }

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
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ ok: false, error: 'Internal server error' });
    }
}