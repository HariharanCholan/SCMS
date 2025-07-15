import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { LogOut, User, Settings, BookOpen, GraduationCap, Building2 } from "lucide-react";

// Import split dashboards
import StudentDashboard from "./dashboards/StudentDashboard";
import FacultyDashboard from "./dashboards/FacultyDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) navigate("/");
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getUserIcon = () => {
    switch (currentUser.userType) {
      case "student": return <GraduationCap className="h-8 w-8 text-primary" />;
      case "faculty": return <BookOpen className="h-8 w-8 text-primary" />;
      case "admin": return <Building2 className="h-8 w-8 text-primary" />;
      default: return <User className="h-8 w-8 text-primary" />;
    }
  };

  const getWelcomeMessage = () => {
    switch (currentUser.userType) {
      case "student": return "Welcome to your Student Dashboard";
      case "faculty": return "Welcome to your Faculty Dashboard";
      case "admin": return "Welcome to your Admin Dashboard";
      default: return "Welcome to your Dashboard";
    }
  };

  const renderRoleDashboard = () => {
    switch (currentUser.userType) {
      case "student": return <StudentDashboard />;
      case "faculty": return <FacultyDashboard />;
      case "admin": return <AdminDashboard />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-6xl"
      >
        <header className="flex justify-between items-center mb-8 bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-4">
            {getUserIcon()}
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{getWelcomeMessage()}</h1>
              <p className="text-gray-600">Logged in as {currentUser.name}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </header>

        {/* Profile Info */}
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{currentUser.name}</p>
                      <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm font-medium">Account Type</p>
                    <p className="text-sm text-muted-foreground capitalize">{currentUser.userType}</p>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm font-medium">Joined</p>
                    <p className="text-sm text-muted-foreground">
                      {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Faculty-only: View Student Progress */}
          {currentUser.userType === "faculty" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Student Progress</CardTitle>
                  <CardDescription>Monitor student academic performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    View progress graphs, grades, and detailed insights for each student.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => navigate("/dashboard/progress")}>
                    View Progress
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {/* Role Based Dynamic Section */}
          <Outlet />
        </main>

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} University Management System. All rights reserved.</p>
          <p className="mt-1">Currently using local storage for data persistence. Connect to MongoDB for production use.</p>
        </footer>
      </motion.div>
    </div>
  );
};

export default Dashboard;



/*
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, User, Settings, BookOpen, GraduationCap, Building2 } from "lucide-react";

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Get the appropriate icon based on user type
  const getUserIcon = () => {
    switch (currentUser.userType) {
      case "student":
        return <GraduationCap className="h-8 w-8 text-primary" />;
      case "faculty":
        return <BookOpen className="h-8 w-8 text-primary" />;
      case "admin":
        return <Building2 className="h-8 w-8 text-primary" />;
      default:
        return <User className="h-8 w-8 text-primary" />;
    }
  };

  // Get the appropriate welcome message based on user type
  const getWelcomeMessage = () => {
    switch (currentUser.userType) {
      case "student":
        return "Welcome to your Student Dashboard";
      case "faculty":
        return "Welcome to your Faculty Dashboard";
      case "admin":
        return "Welcome to your Admin Dashboard";
      default:
        return "Welcome to your Dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-6xl"
      >
        <header className="flex justify-between items-center mb-8 bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-4">
            {getUserIcon()}
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{getWelcomeMessage()}</h1>
              <p className="text-gray-600">Logged in as {currentUser.name}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{currentUser.name}</p>
                      <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm font-medium">Account Type</p>
                    <p className="text-sm text-muted-foreground capitalize">{currentUser.userType}</p>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm font-medium">Joined</p>
                    <p className="text-sm text-muted-foreground">
                      {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
*/
          /* Conditional content based on user type */
/*
          {currentUser.userType === "student" && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>My Courses</CardTitle>
                    <CardDescription>Enrolled courses and progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">You are currently not enrolled in any courses.</p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Browse Courses</Button>
                  </CardFooter>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Upcoming Assignments</CardTitle>
                    <CardDescription>Your pending tasks and deadlines</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">No upcoming assignments at the moment.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View All Assignments</Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </>
          )}

          {currentUser.userType === "faculty" && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>My Classes</CardTitle>
                    <CardDescription>Courses you are teaching</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">You are not assigned to any classes yet.</p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Create New Class</Button>
                  </CardFooter>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Grading</CardTitle>
                    <CardDescription>Pending assignments to grade</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">No pending assignments to grade.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View Grading History</Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </>
          )}

          {currentUser.userType === "admin" && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage system users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Total users: {JSON.parse(localStorage.getItem("users") || "[]").length}</p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Manage Users</Button>
                  </CardFooter>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>System Settings</CardTitle>
                    <CardDescription>Configure system parameters</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">System is running normally.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">System Settings</Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </>
          )}
        </main>

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} University Management System. All rights reserved.</p>
          <p className="mt-1">Currently using local storage for data persistence. Connect to MongoDB for production use.</p>
        </footer>
      </motion.div>
    </div>
  );
};

export default Dashboard;

*/