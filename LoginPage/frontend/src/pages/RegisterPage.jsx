
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
import { KeyRound as UserRound, BookOpen, GraduationCap, Building2, ArrowLeft } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("student");
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      await register({ name, email, password, userType });
      toast({
        title: "Success",
        description: "Account created successfully! You can now log in.",
      });
      navigate("/");
    } catch (error) {
      // Error is handled in the register function
      console.error("Registration error:", error);
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
              <div className="flex items-center justify-between">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => navigate("/")}
                  className="text-white hover:bg-white/20"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <CardTitle className="text-2xl font-bold text-center text-white flex-1 mr-10">
                  Create Account
                </CardTitle>
              </div>
              <CardDescription className="text-center text-white/80">
                Register for a new account to access the system
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
                
                {/* Student Registration Form */}
                <TabsContent value="student">
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="student-name" className="text-white">Full Name</Label>
                        <Input
                          id="student-name"
                          type="text"
                          placeholder="Student Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="bg-white/30 text-white placeholder:text-white/60 border-white/30"
                        />
                      </div>
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
                      <div className="space-y-2">
                        <Label htmlFor="student-confirm-password" className="text-white">Confirm Password</Label>
                        <Input
                          id="student-confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="bg-white/30 text-white placeholder:text-white/60 border-white/30"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-white text-primary hover:bg-white/90"
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating Account..." : "Register as Student"}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
                
                {/* Faculty Registration Form */}
                <TabsContent value="faculty">
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="faculty-name" className="text-white">Full Name</Label>
                        <Input
                          id="faculty-name"
                          type="text"
                          placeholder="Faculty Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="bg-white/30 text-white placeholder:text-white/60 border-white/30"
                        />
                      </div>
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
                      <div className="space-y-2">
                        <Label htmlFor="faculty-confirm-password" className="text-white">Confirm Password</Label>
                        <Input
                          id="faculty-confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="bg-white/30 text-white placeholder:text-white/60 border-white/30"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-white text-primary hover:bg-white/90"
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating Account..." : "Register as Faculty"}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
                
                {/* Admin Registration Form */}
                <TabsContent value="admin">
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="admin-name" className="text-white">Full Name</Label>
                        <Input
                          id="admin-name"
                          type="text"
                          placeholder="Admin Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="bg-white/30 text-white placeholder:text-white/60 border-white/30"
                        />
                      </div>
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
                      <div className="space-y-2">
                        <Label htmlFor="admin-confirm-password" className="text-white">Confirm Password</Label>
                        <Input
                          id="admin-confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="bg-white/30 text-white placeholder:text-white/60 border-white/30"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-white text-primary hover:bg-white/90"
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating Account..." : "Register as Admin"}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-white/80">
                Already have an account?{" "}
                <Link to="/" className="text-white font-semibold hover:underline">
                  Login
                </Link>
              </div>
              <div className="text-xs text-center text-white/60">
                By registering, you agree to our Terms of Service and Privacy Policy
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
