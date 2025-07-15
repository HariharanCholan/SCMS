import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, Building, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminHome = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalRooms: 0,
    totalHours: 0,
    classroomHours: 0,
    auditoriumHours: 0,
    labHours: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    maintenanceRooms: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classroomsRes, bookingsRes, scheduleRes] = await Promise.all([
          fetch('/api/classrooms'),
          fetch('/api/bookings'),
          fetch('/api/schedule')
        ]);

        const [classroomsData, bookingsData, scheduleData] = await Promise.all([
          classroomsRes.json(),
          bookingsRes.json(),
          scheduleRes.json()
        ]);

        setClassrooms(classroomsData);
        setBookings(bookingsData);
        setSchedule(scheduleData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [classrooms, bookings, schedule]);

  const calculateStats = () => {
    const totalRooms = classrooms.length;

    const availableRooms = classrooms.filter(room => room.status === 'available').length;
    const occupiedRooms = classrooms.filter(room => room.status === 'occupied').length;
    const maintenanceRooms = classrooms.filter(room => room.status === 'maintenance').length;

    let totalHours = 0;
    let classroomHours = 0;
    let auditoriumHours = 0;
    let labHours = 0;

    bookings.forEach(booking => {
      const room = classrooms.find(r => r._id === booking.roomId);
      if (room) {
        totalHours += 0.75;

        switch (room.type) {
          case 'classroom':
            classroomHours += 0.75;
            break;
          case 'auditorium':
            auditoriumHours += 0.75;
            break;
          case 'lab':
            labHours += 0.75;
            break;
        }
      }
    });

    schedule.forEach(item => {
      totalHours += 0.75;

      const room = classrooms.find(r => r._id === item.roomId);
      if (room) {
        switch (room.type) {
          case 'classroom':
            classroomHours += 0.75;
            break;
          case 'auditorium':
            auditoriumHours += 0.75;
            break;
          case 'lab':
            labHours += 0.75;
            break;
        }
      }
    });

    setStats({
      totalRooms,
      totalHours: Math.round(totalHours * 10) / 10,
      classroomHours: Math.round(classroomHours * 10) / 10,
      auditoriumHours: Math.round(auditoriumHours * 10) / 10,
      labHours: Math.round(labHours * 10) / 10,
      availableRooms,
      occupiedRooms,
      maintenanceRooms
    });
  };

  const handleStatusCardClick = (status) => {
    navigate(`/admin/manage-classrooms?status=${status}`);
  };

  const statCards = [
    {
      title: 'Total Usage Hours',
      value: `${stats.totalHours}h`,
      description: 'All rooms combined',
      icon: Clock,
      gradient: 'from-blue-600 to-purple-600'
    },
    {
      title: 'Classroom Hours',
      value: `${stats.classroomHours}h`,
      description: 'Regular classrooms only',
      icon: Building,
      gradient: 'from-green-600 to-teal-600'
    },
    {
      title: 'Auditorium Hours',
      value: `${stats.auditoriumHours}h`,
      description: 'Large venues',
      icon: Users,
      gradient: 'from-orange-600 to-red-600'
    },
    {
      title: 'Lab Hours',
      value: `${stats.labHours}h`,
      description: 'Laboratory facilities',
      icon: TrendingUp,
      gradient: 'from-purple-600 to-pink-600'
    }
  ];

  const statusCards = [
    {
      title: 'Available Rooms',
      value: stats.availableRooms,
      description: 'Ready for booking',
      icon: Building,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      statusFilter: 'available'
    },
    {
      title: 'Occupied Rooms',
      value: stats.occupiedRooms,
      description: 'Currently in use',
      icon: Users,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      statusFilter: 'occupied'
    },
    {
      title: 'Maintenance',
      value: stats.maintenanceRooms,
      description: 'Under maintenance',
      icon: AlertTriangle,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      statusFilter: 'maintenance'
    }
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Monitor classroom usage and facility status</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
          <Calendar className="h-6 w-6 mr-2 text-blue-400" />
          Usage Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              >
                <Card className="glass-effect border-gray-700 card-hover">
                  <CardHeader className="pb-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.gradient} flex items-center justify-center mb-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-white text-lg">{stat.title}</CardTitle>
                    <CardDescription className="text-gray-400">{stat.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
          <Building className="h-6 w-6 mr-2 text-blue-400" />
          Room Status Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statusCards.map((status, index) => {
            const Icon = status.icon;
            return (
              <motion.div
                key={status.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                onClick={() => handleStatusCardClick(status.statusFilter)}
                className="cursor-pointer"
              >
                <Card className="glass-effect border-gray-700 card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-medium">{status.title}</p>
                        <p className="text-3xl font-bold text-white mt-2">{status.value}</p>
                        <p className="text-gray-500 text-sm mt-1">{status.description}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-lg ${status.bgColor} flex items-center justify-center`}>
                        <Icon className={`h-6 w-6 ${status.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card className="glass-effect border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
              System Overview
            </CardTitle>
            <CardDescription className="text-gray-400">
              Real-time facility management insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Quick Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Rooms</span>
                    <span className="text-white font-medium">{stats.totalRooms}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Active Bookings</span>
                    <span className="text-white font-medium">{bookings.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Scheduled Events</span>
                    <span className="text-white font-medium">{schedule.length}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Utilization Rate</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Available</span>
                    <span className="text-green-400 font-medium">
                      {stats.totalRooms > 0 ? Math.round((stats.availableRooms / stats.totalRooms) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Occupied</span>
                    <span className="text-red-400 font-medium">
                      {stats.totalRooms > 0 ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Maintenance</span>
                    <span className="text-yellow-400 font-medium">
                      {stats.totalRooms > 0 ? Math.round((stats.maintenanceRooms / stats.totalRooms) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminHome;