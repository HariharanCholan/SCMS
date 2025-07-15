import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { motion } from "framer-motion";

const FacultyDashboard = () => (
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
);

export default FacultyDashboard;
