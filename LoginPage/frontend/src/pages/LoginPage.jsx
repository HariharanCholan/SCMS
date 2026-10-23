
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KeyRound as UserRound, BookOpen, GraduationCap, Building2 } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("student");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    toast({
      title: "Error",
      description: "Please fill in all fields",
      variant: "destructive",
    });
    return;
  }

  try {
    setIsLoading(true);
    await login(email, password, userType);
    // Token is stored in localStorage by AuthContext login()
    // Sub-portals will read localStorage.scms_token on load

    // ✅ Redirect based on user type
    if (userType === "admin") {
      navigate("/dashboard/admin");
    } else if (userType === "faculty") {
      navigate("/dashboard/faculty");
    } else {
      navigate("/dashboard/student");
    }

  } catch (error) {
    console.error("Login error:", error);
    // Error message already shown via toast in login()
  } finally {
    setIsLoading(false);
  }
};



  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center login-background p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <motion.div variants={itemVariants}>
          <Card className="glass-card">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center text-white">
                Campus Login
              </CardTitle>
              <CardDescription className="text-center text-white/80">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="student" onValueChange={setUserType} className="w-full">
                <TabsList className="grid grid-cols-3 mb-4 bg-white/20">
                  <TabsTrigger value="student" className="data-[state=active]:bg-white/30 text-white">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Student
                  </TabsTrigger>
                  <TabsTrigger value="faculty" className="data-[state=active]:bg-white/30 text-white">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Faculty
                  </TabsTrigger>
                  <TabsTrigger value="admin" className="data-[state=active]:bg-white/30 text-white">
                    <Building2 className="mr-2 h-4 w-4" />
                    Admin
                  </TabsTrigger>
                </TabsList>
                
                {/* Student Login Form */}
                <TabsContent value="student">
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="student-email" className="text-white">Email</Label>
                        <Input
                          id="student-email"
                          type="email"
                          placeholder="student@university.edu"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-white/30 text-white placeholder:text-white/60 border-white/30"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="student-password" className="text-white">Password</Label>
                        <Input
                          id="student-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-white/30 text-white placeholder:text-white/60 border-white/30"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-white text-primary hover:bg-white/90"
                        disabled={isLoading}
                      >
                        {isLoading ? "Logging in..." : "Login as Student"}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
                
                {/* Faculty Login Form */}
                <TabsContent value="faculty">
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="faculty-email" className="text-white">Email</Label>
                        <Input
                          id="faculty-email"
                          type="email"
                          placeholder="faculty@university.edu"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-white/30 text-white placeholder:text-white/60 border-white/30"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="faculty-password" className="text-white">Password</Label>
                        <Input
                          id="faculty-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-white/30 text-white placeholder:text-white/60 border-white/30"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-white text-primary hover:bg-white/90"
                        disabled={isLoading}
                      >
                        {isLoading ? "Logging in..." : "Login as Faculty"}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
                
                {/* Admin Login Form */}
                <TabsContent value="admin">
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="admin-email" className="text-white">Email</Label>
                        <Input
                          id="admin-email"
                          type="email"
                          placeholder="admin@university.edu"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-white/30 text-white placeholder:text-white/60 border-white/30"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="admin-password" className="text-white">Password</Label>
                        <Input
                          id="admin-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-white/30 text-white placeholder:text-white/60 border-white/30"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-white text-primary hover:bg-white/90"
                        disabled={isLoading}
                      >
                        {isLoading ? "Logging in..." : "Login as Admin"}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-white/80">
                Don't have an account?{" "}
                <Link to="/register" className="text-white font-semibold hover:underline">
                  Create Account
                </Link>
              </div>
              <div className="text-xs text-center text-white/60">
                By logging in, you agree to our Terms of Service and Privacy Policy
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
