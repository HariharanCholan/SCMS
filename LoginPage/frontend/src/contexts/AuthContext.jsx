import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load user session from MongoDB via backend
    const fetchSession = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/session", {
          withCredentials: true,
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

  // Login function
  const login = async (email, password, userType) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/login",
        {
          email,
          password,
          userType,
        },
        { withCredentials: true } // Send cookies for session
      );

      const user = response.data;

      // Remove password before storing in state
      const { password: _, ...userWithoutPassword } = user;

      setCurrentUser(userWithoutPassword);

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

  // Register function
  const register = async (userData) => {
    try {
      const response = await axios.post("http://localhost:8000/api/register", userData);
      const user = response.data;

      // Remove password before returning
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
      await axios.post(
        "http://localhost:8000/api/logout",
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Logout failed on backend", err);
    }

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
    const response = await axios.post("http://localhost:5000/api/login", {
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
    const response = await axios.post("http://localhost:5000/api/register", userData);
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
