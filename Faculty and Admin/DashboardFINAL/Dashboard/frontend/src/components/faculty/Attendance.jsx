
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCheck, Calendar, Clock, Users, Settings } from 'lucide-react';

const Attendance = () => {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-white mb-2">Attendance Management</h1>
        <p className="text-gray-400">Track and manage student attendance</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="glass-effect border-gray-700">
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <UserCheck className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-white text-2xl">Attendance System</CardTitle>
            <CardDescription className="text-gray-400 text-lg">
              Feature coming soon - attendance tracking will be integrated here
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 glass-effect border border-gray-600 rounded-lg">
                <Calendar className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold">Daily Attendance</h3>
                <p className="text-gray-400 text-sm">Mark daily attendance</p>
              </div>
              
              <div className="text-center p-4 glass-effect border border-gray-600 rounded-lg">
                <Clock className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold">Time Tracking</h3>
                <p className="text-gray-400 text-sm">Track session duration</p>
              </div>
              
              <div className="text-center p-4 glass-effect border border-gray-600 rounded-lg">
                <Users className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold">Reports</h3>
                <p className="text-gray-400 text-sm">Generate attendance reports</p>
              </div>
            </div>

            <div className="text-center pt-6">
              <Button 
                disabled
                className="bg-gradient-to-r from-blue-600 to-purple-600 opacity-50 cursor-not-allowed"
              >
                <Settings className="h-4 w-4 mr-2" />
                Configure Attendance System
              </Button>
              <p className="text-gray-500 text-sm mt-2">
                This feature will be available in the next update
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Attendance;
