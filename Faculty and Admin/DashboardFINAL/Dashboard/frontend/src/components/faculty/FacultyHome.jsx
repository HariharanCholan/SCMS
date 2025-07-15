import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Building, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ClassroomStatusGrid from '@/components/faculty/ClassroomStatusGrid';
import BookingDialog from '@/components/faculty/BookingDialog';
import MyBookingsList from '@/components/faculty/MyBookingsList';
import StatusUpdateDialog from '@/components/faculty/StatusUpdateDialog';

const FacultyHome = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedRoomForStatusUpdate, setSelectedRoomForStatusUpdate] = useState(null);

  // Fetch classrooms from backend on mount
  useEffect(() => {
    fetch('/api/classrooms')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch classrooms');
        return res.json();
      })
      .then(data => setClassrooms(data))
      .catch(err => {
        console.error('Error loading classrooms:', err);
        setClassrooms([]); // fallback empty
      });
  }, []);

  // Fetch bookings from backend on mount
  useEffect(() => {
    fetch('/api/bookings')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch bookings');
        return res.json();
      })
      .then(data => setBookings(data))
      .catch(err => {
        console.error('Error loading bookings:', err);
        setBookings([]); // fallback empty
      });
  }, []);

  // Optionally, you may want to create helper functions to refresh bookings/classrooms
  // after dialogs update data, so you can call them from dialogs via props.

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Faculty Dashboard</h1>
          <p className="text-gray-400">Manage room bookings and update facility status</p>
        </div>

        <Button
          onClick={() => setIsBookingDialogOpen(true)}
          className="bg-gradient-to-r from-green-600 to-teal-600 hover:opacity-90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Book Room
        </Button>
      </motion.div>

      <BookingDialog
        isOpen={isBookingDialogOpen}
        setIsOpen={setIsBookingDialogOpen}
        classrooms={classrooms}
        bookings={bookings}
        setBookings={setBookings}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
          <Building className="h-6 w-6 mr-2 text-green-400" />
          Classroom Status
        </h2>
        <ClassroomStatusGrid
          classrooms={classrooms}
          setSelectedRoom={setSelectedRoomForStatusUpdate}
          setIsStatusDialogOpen={setIsStatusDialogOpen}
        />
      </motion.div>

      <StatusUpdateDialog
        isOpen={isStatusDialogOpen}
        setIsOpen={setIsStatusDialogOpen}
        selectedRoom={selectedRoomForStatusUpdate}
        setClassrooms={setClassrooms}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
          <Calendar className="h-6 w-6 mr-2 text-green-400" />
          My Bookings
        </h2>
        <MyBookingsList bookings={bookings} setBookings={setBookings} />
      </motion.div>
    </div>
  );
};

export default FacultyHome;
