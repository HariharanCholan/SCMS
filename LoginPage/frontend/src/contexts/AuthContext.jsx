import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const API_BASE = "http://localhost:5000";

  useEffect(() => {
    // Load user session from unified backend
    const fetchSession = async () => {
      try {
        const token = localStorage.getItem("scms_token");
        const response = await axios.get(`${API_BASE}/api/auth/me`, {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setCurrentUser(response.data.user);
      } catch (err) {
        setCurrentUser(null); // No active session
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  // Login function — unified backend
  const login = async (email, password, userType) => {
    try {
      const response = await axios.post(
        `${API_BASE}/api/auth/login`,
        { email, password, userType },
        { withCredentials: true }
      );

      const user = response.data;
      const { password: _, token, ...userWithoutPassword } = user;

      // Store JWT for cross-port usage
      if (token) {
        localStorage.setItem("scms_token", token);
        localStorage.setItem("scms_user", JSON.stringify(userWithoutPassword));
      }

      setCurrentUser(userWithoutPassword);

      toast({
        title: "Login Successful",
        description: `Welcome back, ${userWithoutPassword.name}!`,
      });

      return { ...userWithoutPassword, token };
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_BASE}/api/auth/register`, userData);
      const user = response.data;
      const { password: _, ...userWithoutPassword } = user;

      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully!",
      });

      return userWithoutPassword;
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const token = localStorage.getItem("scms_token");
      await axios.post(
        `${API_BASE}/api/auth/logout`,
        {},
        { withCredentials: true, headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
    } catch (err) {
      console.error("Logout failed on backend", err);
    }

    localStorage.removeItem("scms_token");
    localStorage.removeItem("scms_user");
    setCurrentUser(null);

    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};


/*
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const user = localStorage.getItem("user");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password, userType) => {
  try {
    const response = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password,
      userType
    });

    const user = response.data;

    // Remove password if included
    const { password: _, ...userWithoutPassword } = user;

    setCurrentUser(userWithoutPassword);
    localStorage.setItem("user", JSON.stringify(userWithoutPassword)); // Optional

    toast({
      title: "Login Successful",
      description: `Welcome back, ${userWithoutPassword.name}!`,
    });

    return userWithoutPassword;
  } catch (error) {
    toast({
      title: "Login Failed",
      description: error.response?.data?.message || error.message,
      variant: "destructive",
    });
    throw error;
    }
  };

  
  const login = async (email, password, userType) => {
    try {
      // In a real app, this would be an API call to MongoDB
      // For now, we'll simulate with localStorage
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists (in real app, this would be a DB query)
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find(u => 
        u.email === email && 
        u.password === password && 
        u.userType === userType
      );
      
      if (!user) {
        throw new Error("Invalid credentials");
      }
      
      // Remove password before storing in state/localStorage
      const { password: _, ...userWithoutPassword } = user;
      
      setCurrentUser(userWithoutPassword);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userWithoutPassword.name}!`,
      });
      
      return userWithoutPassword;
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };


  // Register function
  const register = async (userData) => {
  try {
    const response = await axios.post("http://localhost:5000/api/auth/register", userData);
    const user = response.data;

    const { password: _, ...userWithoutPassword } = user;

    toast({
      title: "Registration Successful",
      description: "Your account has been created successfully!",
    });

    return userWithoutPassword;
  } catch (error) {
    toast({
      title: "Registration Failed",
      description: error.response?.data?.message || error.message,
      variant: "destructive",
    });
    throw error;
  }
};

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        userType,
        createdAt: new Date().toISOString(),
      };
      
      // Save to "database"
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      
      // Remove password before storing in state/localStorage
      const { password: _, ...userWithoutPassword } = newUser;
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully!",
      });
      
      return userWithoutPassword;
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );



//Register Local Storage
    try {
      // In a real app, this would be an API call to MongoDB
      // For now, we'll simulate with localStorage
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { name, email, password, userType } = userData;
      
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const existingUser = users.find(u => u.email === email && u.userType === userType);
      
      if (existingUser) {
        throw new Error("User already exists with this email and role");
      }
*/
