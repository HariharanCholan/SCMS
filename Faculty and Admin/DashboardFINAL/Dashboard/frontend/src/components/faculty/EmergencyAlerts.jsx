
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Bell, Shield, Phone, MessageSquare, Settings } from 'lucide-react';

const EmergencyAlerts = () => {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-white mb-2">Emergency Alerts</h1>
        <p className="text-gray-400">Manage emergency notifications and alerts</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="glass-effect border-gray-700">
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-red-500 to-orange-600 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">Emergency Alert System</CardTitle>
            <CardDescription className="text-gray-400">
              This module will be connected later. All emergency alert functionality will be integrated here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button className="h-16 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
                <Bell className="w-5 h-5 mr-2" />
                Send Alert
              </Button>
              <Button className="h-16 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white">
                <Shield className="w-5 h-5 mr-2" />
                Safety Protocols
              </Button>
              <Button className="h-16 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white">
                <Phone className="w-5 h-5 mr-2" />
                Emergency Contacts
              </Button>
              <Button className="h-16 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white">
                <MessageSquare className="w-5 h-5 mr-2" />
                Alert History
              </Button>
            </div>
            <div className="text-center p-8 border-2 border-dashed border-gray-600 rounded-lg">
              <p className="text-gray-400 text-lg">
                Emergency Alert system will be integrated here
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Connect your existing emergency module to enable full functionality
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default EmergencyAlerts;
