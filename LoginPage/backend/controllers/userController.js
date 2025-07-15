import Student from "../models/Student.js";
import Faculty from "../models/Faculty.js";
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";

const getModelByUserType = (userType) => {
  if (userType === "student") return Student;
  if (userType === "faculty") return Faculty;
  if (userType === "admin") return Admin;
  throw new Error("Invalid userType");
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, userType } = req.body;

    const Model = getModelByUserType(userType);

    const existingUser = await Model.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email and role" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Model({
      name,
      email,
      password: hashedPassword,
      userType,
    });

    await newUser.save();

    const { password: _, ...userWithoutPassword } = newUser.toObject();

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    const Model = getModelByUserType(userType);

    const user = await Model.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Save user info in session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      userType: user.userType,
    };

    const { password: _, ...userWithoutPassword } = user.toObject();

    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

export const getSessionUser = (req, res) => {
  if (req.session && req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: "No active session" });
  }
};

export const logoutUser = (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out successfully" });
    });
  } else {
    res.status(400).json({ message: "No session to log out" });
  }
};
