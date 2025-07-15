import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Calendar, Clock, MapPin, Trash2 } from 'lucide-react';

const MyBookingsList = ({ bookings, setBookings }) => {
  const { toast } = useToast();

  const handleDeleteBooking = (id) => {
    setBookings(prev => prev.filter(booking => booking._id !== id));
    toast({
      title: "Success",
      description: "Booking cancelled successfully"
    });
  };

  if (bookings.length === 0) {
    return (
      <Card className="glass-effect border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">My Bookings</CardTitle>
          <CardDescription className="text-gray-400">Your upcoming classroom reservations</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No bookings yet</p>
          <p className="text-gray-500 text-sm">Book your first classroom to get started</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">My Bookings</CardTitle>
        <CardDescription className="text-gray-400">Your upcoming classroom reservations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {bookings.slice(0, 5).map((booking, index) => (
          <motion.div
            key={booking._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="glass-effect border border-gray-600 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h3 className="text-lg font-semibold text-white">
                    {booking.subject}
                  </h3>
                  <p className="text-sm text-gray-400">
                    By: {booking.facultyId?.name || "Unknown Faculty"}
                  </p>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                    {booking.roomType}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {booking.roomName}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {booking.timeSlot}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(booking.date).toLocaleDateString()}
                  </div>
                </div>
                {booking.notes && (
                  <p className="text-gray-500 text-sm mt-2">{booking.notes}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteBooking(booking._id)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MyBookingsList;