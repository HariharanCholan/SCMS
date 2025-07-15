import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const ALL_TIME_SLOTS = [
  '8:00 - 8:45', '8:45 - 9:30', '9:45 - 10:30', '10:30 - 11:15',
  '12:00 - 12:45', '12:45 - 1:30', '1:30 - 2:15', '2:15 - 3:00'
];

const BookingDialog = ({ isOpen, setIsOpen, classrooms, bookings, setBookings }) => {
  const { toast } = useToast();
  const [schedule, setSchedule] = useState([]);
  const [formData, setFormData] = useState({
    roomId: '',
    subject: '',
    timeSlot: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [availableTimeSlots, setAvailableTimeSlots] = useState(ALL_TIME_SLOTS);
  const facultyId = localStorage.getItem("userId"); // adjust key if needed

  useEffect(() => {
    if (isOpen) {
      fetch('/api/schedule')
        .then(res => res.json())
        .then(data => setSchedule(data))
        .catch(err => {
          console.error('Failed to fetch schedule', err);
          setSchedule([]);
        });
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.roomId && formData.date) {
      const facultyBookedSlots = bookings
        .filter(b => b.roomId === formData.roomId && b.date === formData.date)
        .map(b => b.timeSlot);

      const adminScheduledSlots = schedule
        .filter(s => s.roomId === formData.roomId && s.date === formData.date)
        .map(s => s.timeSlot);

      const combinedBookedSlots = [...new Set([...facultyBookedSlots, ...adminScheduledSlots])];

      const filteredSlots = ALL_TIME_SLOTS.filter(slot => !combinedBookedSlots.includes(slot));
      setAvailableTimeSlots(filteredSlots);

      if (!filteredSlots.includes(formData.timeSlot)) {
        setFormData(prev => ({ ...prev, timeSlot: '' }));
      }
    } else {
      setAvailableTimeSlots(ALL_TIME_SLOTS);
    }
  }, [formData.roomId, formData.date, bookings, schedule]);

  const resetForm = () => {
    setFormData({
      roomId: '',
      subject: '',
      timeSlot: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!formData.roomId || !formData.subject || !formData.timeSlot) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const room = classrooms.find(r => r._id === formData.roomId);
    if (!room) {
      toast({
        title: "Error",
        description: "Selected room not found",
        variant: "destructive"
      });
      return;
    }

    if (room.status !== 'available') {
      toast({
        title: "Error",
        description: `Room "${room.name}" is currently ${room.status} and cannot be booked.`,
        variant: "destructive"
      });
      return;
    }

    const booking = {
      ...formData,
      roomName: room.name,
      roomType: room.type,
      facultyId,
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
      });

      if (!res.ok) {
        throw new Error('Failed to create booking');
      }

      const savedBooking = await res.json();
      setBookings(prev => [...prev, savedBooking]);

      toast({
        title: "Success",
        description: "Room booked successfully"
      });

      resetForm();
      setIsOpen(false);

    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Booking failed",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetForm();
    }}>
      <DialogContent className="glass-effect border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Book a Classroom</DialogTitle>
          <DialogDescription className="text-gray-400">
            Reserve a classroom for your next session
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleBooking} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="roomId">Classroom</Label>
            <Select
              value={formData.roomId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, roomId: value, timeSlot: '' }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a classroom" />
              </SelectTrigger>
              <SelectContent>
                {classrooms.filter(room => room.status === 'available').map(room => (
                  <SelectItem key={room._id} value={room._id}>
                    {room.name} ({room.type}) - {room.capacity} seats
                  </SelectItem>
                ))}
                {classrooms.filter(room => room.status !== 'available').map(room => (
                  <SelectItem key={room._id} value={room._id} disabled>
                    {room.name} ({room.type}) - {room.status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              _id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value, timeSlot: '' }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeSlot">Time Slot</Label>
            <Select
              value={formData.timeSlot}
              onValueChange={(value) => setFormData(prev => ({ ...prev, timeSlot: value }))}
              disabled={!formData.roomId || !formData.date}
            >
              <SelectTrigger>
                <SelectValue placeholder={!formData.roomId || !formData.date ? "Select room and date first" : "Select time slot"} />
              </SelectTrigger>
              <SelectContent>
                {availableTimeSlots.length > 0 ? availableTimeSlots.map(slot => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                )) : <SelectItem value="no-slots" disabled>No available slots for this room/date</SelectItem>}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject/Purpose</Label>
            <Input
              _id="subject"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Enter subject or purpose"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              _id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => { setIsOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-green-600 to-teal-600">
              Book Room
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
