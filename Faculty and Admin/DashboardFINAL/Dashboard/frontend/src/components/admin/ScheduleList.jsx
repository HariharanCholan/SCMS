import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Calendar, Clock, MapPin, Users, Trash2, Edit } from 'lucide-react';

const ScheduleList = ({ schedule, setSchedule, setEditingItem, setIsDialogOpen }) => {
  const { toast } = useToast();

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
  try {
    const res = await fetch(`http://localhost:5000/api/schedule/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error('Server delete failed');

    setSchedule(prev => prev.filter(item => item._id !== id));

    toast({
      title: "Deleted",
      description: "Schedule item removed from server",
    });
  } catch (err) {
    toast({
      title: "Error",
      description: "Failed to delete from backend",
      variant: "destructive",
    });
  }
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <Card className="glass-effect border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Current Schedule</CardTitle>
          <CardDescription className="text-gray-400">
            All scheduled classes and resource allocations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {schedule.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No schedules added yet</p>
              <p className="text-gray-500 text-sm">Add your first schedule to start tracking resources</p>
            </div>
          ) : (
            <div className="space-y-4">
              {schedule.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="glass-effect border border-gray-600 rounded-lg p-4 card-hover"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-lg font-semibold text-white">{item.subject}</h3>
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                          {item.roomType}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-400">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {item.roomName}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          {item.faculty}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {item.timeSlot}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(item.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(item)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item._id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ScheduleList;