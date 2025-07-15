/*
// This service will handle MongoDB Atlas connections
// Note: This is a placeholder for future implementation
// Currently using localStorage for data persistence

// In a real application, you would use the mongodb package to connect to MongoDB Atlas
// The actual implementation would require server-side code or a serverless function

export const mongoService = {
  // This is a placeholder for the future MongoDB implementation
  // In a real application, you would connect to MongoDB Atlas here
  
  // Example of how the connection might be implemented in a real application:
  // async connect() {
  //   try {
  //     // This would be implemented in a backend service
  //     // const client = new MongoClient(process.env.MONGODB_URI);
  //     // await client.connect();
  //     // const db = client.db('university_system');
  //     // return db;
  //   } catch (error) {
  //     console.error('MongoDB connection error:', error);
  //     throw error;
  //   }
  // },

  // User operations
  async getUsers() {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return JSON.parse(localStorage.getItem('users') || '[]');
  },

  async getUserByEmail(email, userType) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find(user => user.email === email && user.userType === userType);
  },

  async createUser(userData) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    const existingUser = users.find(
      user => user.email === userData.email && user.userType === userData.userType
    );
    
    if (existingUser) {
      throw new Error('User already exists with this email and role');
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    return newUser;
  },

  async updateUser(userId, userData) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    users[userIndex] = { ...users[userIndex], ...userData };
    localStorage.setItem('users', JSON.stringify(users));
    
    return users[userIndex];
  },

  async deleteUser(userId) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const filteredUsers = users.filter(user => user.id !== userId);
    localStorage.setItem('users', JSON.stringify(filteredUsers));
    
    return { success: true };
  }
};

// Note: In a real application, you would implement MongoDB connection
// and operations using the mongodb package on the server side.
// This client-side implementation is just a placeholder using localStorage.
*/


// src/services/mongoService.js
import axios from "axios";

const BASE_URL = "http://localhost:8000/api/users"; // or your backend URL

export const mongoService = {
  async getUsers() {
    const res = await axios.get(`${BASE_URL}/`);
    return res.data;
  },

  async getUserByEmail(email, userType) {
    const res = await axios.post(`${BASE_URL}/find`, { email, userType });
    return res.data;
  },

  async createUser(userData) {
    const res = await axios.post(`${BASE_URL}/create`, userData);
    return res.data;
  },

  async updateUser(userId, userData) {
    const res = await axios.put(`${BASE_URL}/update/${userId}`, userData);
    return res.data;
  },

  async deleteUser(userId) {
    const res = await axios.delete(`${BASE_URL}/delete/${userId}`);
    return res.data;
  }
};
