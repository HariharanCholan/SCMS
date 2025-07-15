import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const users = JSON.parse(localStorage.getItem("users") || "[]");

  return (
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
            <p className="text-sm text-muted-foreground">Total users: {users.length}</p>
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
  );
};

export default AdminDashboard;
