import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, MapPin, Users, Calendar } from 'lucide-react';

const ResourceStats = ({ schedule }) => {
  const getStats = () => {
    const stats = {
      total: 0,
      classroom: 0,
      auditorium: 0,
      lab: 0
    };

    schedule.forEach(item => {
      const duration = parseInt(item.duration || '45', 10);
      if (isNaN(duration)) return;

      const hours = duration / 60;
      stats.total += hours;

      const roomType = (item.roomType || '').toLowerCase();
      if (roomType === 'classroom') stats.classroom += hours;
      else if (roomType === 'auditorium') stats.auditorium += hours;
      else if (roomType === 'lab' || roomType === 'laboratory') stats.lab += hours;
    });

    return stats;
  };

  const stats = getStats();

  const statCards = [
    { title: 'Total Hours', value: `${stats.total.toFixed(1)}h`, icon: Clock, iconColor: 'text-blue-400' },
    { title: 'Classroom Hours', value: `${stats.classroom.toFixed(1)}h`, icon: Users, iconColor: 'text-green-400' },
    { title: 'Auditorium Hours', value: `${stats.auditorium.toFixed(1)}h`, icon: MapPin, iconColor: 'text-orange-400' },
    { title: 'Lab Hours', value: `${stats.lab.toFixed(1)}h`, icon: Calendar, iconColor: 'text-purple-400' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statCards.map(stat => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="glass-effect border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.iconColor}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ResourceStats;