
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, BookOpen, Settings } from 'lucide-react';

const DashboardSelector = () => {
  const navigate = useNavigate();

  const dashboards = [
    {
      title: 'Admin Dashboard',
      description: 'Manage classrooms, track resources, and oversee facility operations',
      icon: Shield,
      path: '/admin',
      gradient: 'from-blue-600 to-purple-600',
      features: ['Resource Tracking', 'Classroom Management', 'Analytics']
    },
    {
      title: 'Faculty Dashboard',
      description: 'Book classrooms, manage attendance, and access teaching tools',
      icon: Users,
      path: '/faculty',
      gradient: 'from-green-600 to-teal-600',
      features: ['Room Booking', 'Student Insights', 'Quiz Generator']
    }
  ];

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-6">
      <div className="max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <BookOpen className="h-12 w-12 text-blue-400 mr-4" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Smart Classroom
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Advanced classroom management system for modern educational institutions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {dashboards.map((dashboard, index) => {
            const Icon = dashboard.icon;
            return (
              <motion.div
                key={dashboard.title}
                initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              >
                <Card className="glass-effect border-gray-700 card-hover group cursor-pointer h-full">
                  <CardHeader className="text-center pb-4">
                    <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${dashboard.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-white mb-2">{dashboard.title}</CardTitle>
                    <CardDescription className="text-gray-300 text-base">
                      {dashboard.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {dashboard.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-gray-300">
                          <Settings className="h-4 w-4 text-blue-400 mr-2" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={() => navigate(dashboard.path)}
                      className={`w-full bg-gradient-to-r ${dashboard.gradient} hover:opacity-90 text-white font-semibold py-3 rounded-lg transition-all duration-300 group-hover:neon-glow`}
                    >
                      Access Dashboard
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-gray-400">
            Choose your dashboard to get started with smart classroom management
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardSelector;
