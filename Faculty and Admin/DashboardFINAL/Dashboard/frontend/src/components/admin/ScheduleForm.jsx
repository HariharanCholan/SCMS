import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

const ALL_TIME_SLOTS = [
  '8:00 - 8:45', '8:45 - 9:30', '9:45 - 10:30', '10:30 - 11:15',
  '12:00 - 12:45', '12:45 - 1:30', '1:30 - 2:15', '2:15 - 3:00'
];

const ScheduleForm = ({ isOpen, setIsOpen, editingItem, setEditingItem, classrooms, schedule, setSchedule, onSave, onDelete }) => {
  const { toast } = useToast();

  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({
    roomId: '',
    subject: '',
    faculty: '',
    timeSlot: '',
    date: new Date().toISOString().split('T')[0],
    duration: '45'
  });
  const [availableTimeSlots, setAvailableTimeSlots] = useState(ALL_TIME_SLOTS);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch('http://localhost:5000/api/admin/bookings');
        if (!res.ok) throw new Error('Failed to fetch bookings');
        const data = await res.json();
        setBookings(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load bookings data",
          variant: "destructive"
        });
      }
    }

    if (isOpen) {
      fetchBookings();
    }
  }, [isOpen, toast]);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        roomId: editingItem.roomId,
        subject: editingItem.subject,
        faculty: editingItem.faculty,
        timeSlot: editingItem.timeSlot,
        date: editingItem.date,
        duration: editingItem.duration
      });
    } else {
      resetForm();
    }
  }, [editingItem, isOpen]);

  useEffect(() => {
    if (formData.roomId && formData.date) {
      const bookedFacultySlots = bookings
        .filter(b => b.roomId === formData.roomId && b.date === formData.date)
        .map(b => b.timeSlot);

      const scheduledAdminSlots = schedule
        .filter(s => s.roomId === formData.roomId && s.date === formData.date && s._id !== (editingItem?._id || null))
        .map(s => s.timeSlot);

      const combinedBookedSlots = [...new Set([...bookedFacultySlots, ...scheduledAdminSlots])];

      setAvailableTimeSlots(ALL_TIME_SLOTS.filter(slot => !combinedBookedSlots.includes(slot)));
    } else {
      setAvailableTimeSlots(ALL_TIME_SLOTS);
    }
    if (!availableTimeSlots.includes(formData.timeSlot)) {
      setFormData(prev => ({ ...prev, timeSlot: '' }));
    }
  }, [formData.roomId, formData.date, bookings, schedule, editingItem]);

  const resetForm = () => {
    setFormData({
      roomId: '',
      subject: '',
      faculty: '',
      timeSlot: '',
      date: new Date().toISOString().split('T')[0],
      duration: '45'
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.roomId || !formData.subject || !formData.faculty || !formData.timeSlot) {
    toast({
      title: "Error",
      description: "Please fill in all required fields",
      variant: "destructive",
    });
    return;
  }

  const room = classrooms.find((r) => r._id === formData.roomId);
  if (!room) {
    toast({
      title: "Error",
      description: "Selected room not found",
      variant: "destructive",
    });
    return;
  }

  if (room.status !== 'available') {
    toast({
      title: "Error",
      description: `Room "${room.name}" is currently ${room.status} and cannot be scheduled.`,
      variant: "destructive",
    });
    return;
  }

  const scheduleItem = {
    _id: editingItem ? editingItem._id : Date.now().toString(),
    ...formData,
    classroom: formData.roomId,
    roomName: room.name,
    roomType: room.type,
    createdAt: editingItem ? editingItem.createdAt : new Date().toISOString(),
  };

  try {
    if (onSave) {
      await onSave(scheduleItem); // ✅ use backend save
    } else {
      // fallback local update if no onSave is provided
      if (editingItem) {
        setSchedule((prev) =>
          prev.map((item) =>
            item._id === editingItem._id ? scheduleItem : item
          )
        );
      } else {
        setSchedule((prev) => [...prev, scheduleItem]);
      }
    }

    toast({
      title: "Success",
      description: `Schedule ${editingItem ? 'updated' : 'added'} successfully`,
    });

    setIsOpen(false);
    setEditingItem(null);
  } catch (error) {
    console.error(error);
    toast({
      title: "Error",
      description: "Failed to save schedule",
      variant: "destructive",
    });
  }
};

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) setEditingItem(null);
    }}>
      <DialogContent className="glass-effect border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>{editingItem ? 'Edit Schedule' : 'Add New Schedule'}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {editingItem ? 'Update the schedule details' : 'Create a new schedule entry for resource tracking'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
                    {room.name} ({room.type})
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
            <Label htmlFor="subject">Subject</Label>
            <Input
              _id="subject"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Enter subject name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="faculty">Faculty</Label>
            <Input
              _id="faculty"
              value={formData.faculty}
              onChange={(e) => setFormData(prev => ({ ...prev, faculty: e.target.value }))}
              placeholder="Enter faculty name"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => { setIsOpen(false); setEditingItem(null); }}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600">
              {editingItem ? 'Update' : 'Add'} Schedule
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleForm;
