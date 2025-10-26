import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    user = await User.create({ firstName, lastName, email, password: hashed });

    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '48h' });

    res.json({
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email },
      token
    });
  } catch (err) {
    next(err);
  }
};

// Logout can be handled client‐side by discarding token (or implement token blacklist if desired)
export const logout = async (req, res) => {
  // Optionally: add token to blacklist
  res.json({ message: 'Logged out' });
};
