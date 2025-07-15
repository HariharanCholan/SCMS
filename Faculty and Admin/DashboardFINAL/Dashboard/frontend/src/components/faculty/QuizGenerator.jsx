
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, PlusCircle, Edit, BarChart3, Settings } from 'lucide-react';

const QuizGenerator = () => {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-white mb-2">Quiz Generator</h1>
        <p className="text-gray-400">Create and manage quizzes for your students</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="glass-effect border-gray-700">
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">Quiz Generator Module</CardTitle>
            <CardDescription className="text-gray-400">
              This module will be connected later. All quiz generation functionality will be integrated here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button className="h-16 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                <PlusCircle className="w-5 h-5 mr-2" />
                Create New Quiz
              </Button>
              <Button className="h-16 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white">
                <Edit className="w-5 h-5 mr-2" />
                Edit Existing Quiz
              </Button>
              <Button className="h-16 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white">
                <BarChart3 className="w-5 h-5 mr-2" />
                Quiz Analytics
              </Button>
              <Button className="h-16 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white">
                <Settings className="w-5 h-5 mr-2" />
                Quiz Settings
              </Button>
            </div>
            <div className="text-center p-8 border-2 border-dashed border-gray-600 rounded-lg">
              <p className="text-gray-400 text-lg">
                Quiz Generator functionality will be integrated here
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Connect your existing quiz module to enable full functionality
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default QuizGenerator;
