import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { motion } from "framer-motion";

const StudentDashboard = () => (
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
);

export default StudentDashboard;
