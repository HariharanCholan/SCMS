// backend/controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUserModels } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'scms_jwt_secret_dev_key';

export const register = async (req, res) => {
  try {
    const { name, email, password, userType = 'student' } = req.body;
    const { Student, Faculty, Admin, User } = getUserModels();

    let TargetModel = User;
    if (userType === 'student') TargetModel = Student;
    else if (userType === 'faculty') TargetModel = Faculty;
    else if (userType === 'admin') TargetModel = Admin;

    const existingUser = await TargetModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new TargetModel({
      name,
      email,
      password: hashedPassword,
      userType,
    });

    await newUser.save();

    const userObj = newUser.toObject();
    delete userObj.password;

    const token = jwt.sign(
      { id: userObj._id, email: userObj.email, role: userType, name: userObj.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      ...userObj,
      token,
      message: 'User registered successfully',
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Registration failed: ' + err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    const { Student, Faculty, Admin, User } = getUserModels();

    let TargetModel = User;
    if (userType === 'student') TargetModel = Student;
    else if (userType === 'faculty') TargetModel = Faculty;
    else if (userType === 'admin') TargetModel = Admin;

    // Look for user in role-specific collection or generic user collection
    let user = await TargetModel.findOne({ email });
    if (!user) {
      user = await User.findOne({ email });
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials or user not found' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const userObj = user.toObject();
    delete userObj.password;

    const role = userObj.userType || userType || 'student';

    const token = jwt.sign(
      { id: userObj._id, email: userObj.email, role, name: userObj.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Also support session if session middleware is active
    if (req.session) {
      req.session.user = {
        id: userObj._id,
        name: userObj.name,
        email: userObj.email,
        userType: role,
      };
    }

    res.json({
      ...userObj,
      userType: role,
      token,
      message: 'Login successful',
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed: ' + err.message });
  }
};

export const getSession = (req, res) => {
  // Check auth header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return res.json({ user: decoded });
    } catch (e) {
      // fallback to session
    }
  }

  if (req.session && req.session.user) {
    return res.json({ user: req.session.user });
  }

  res.status(401).json({ message: 'No active session' });
};

export const logout = (req, res) => {
  if (req.session) {
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out successfully' });
    });
  } else {
    res.json({ message: 'Logged out successfully' });
  }
};

// Compatibility for mongoService: getUsers, findUser, createUser, updateUser
export const getUsers = async (req, res) => {
  try {
    const { User, Student, Faculty, Admin } = getUserModels();
    const students = await Student.find({}, '-password');
    const faculty = await Faculty.find({}, '-password');
    const admins = await Admin.find({}, '-password');
    res.json([...students, ...faculty, ...admins]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const findUser = async (req, res) => {
  try {
    const { email, userType } = req.body;
    const { Student, Faculty, Admin, User } = getUserModels();
    let TargetModel = User;
    if (userType === 'student') TargetModel = Student;
    else if (userType === 'faculty') TargetModel = Faculty;
    else if (userType === 'admin') TargetModel = Admin;

    const user = await TargetModel.findOne({ email }, '-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createUser = async (req, res) => {
  // Delegate to register
  return register(req, res);
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { Student, Faculty, Admin, User } = getUserModels();
    const updateData = { ...req.body };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    let updated = await Student.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) updated = await Faculty.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) updated = await Admin.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) updated = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!updated) return res.status(404).json({ message: 'User not found' });
    const userObj = updated.toObject();
    delete userObj.password;
    res.json(userObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
