import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter } from 'lucide-react';
import ScheduleForm from '@/components/admin/ScheduleForm';
import ScheduleList from '@/components/admin/ScheduleList';
import ResourceStats from '@/components/admin/ResourceStats';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TrackResources = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('');

  // 🔁 Helper: enrich a schedule item with room data
  const enrichScheduleItem = (item, classrooms) => {
    const classroom = classrooms.find(c => c._id === item.roomId);
    const type = (classroom?.type || 'unknown').toLowerCase();
    const name = classroom?.name || 'Unknown Room';
    return {
      ...item,
      roomType: type,
      roomName: name,
    };
  };

  // 🧠 Fetch classrooms and schedule on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const classroomRes = await fetch('/api/classrooms');
        const scheduleRes = await fetch('/api/schedule');

        const classrooms = await classroomRes.json();
        const schedule = await scheduleRes.json();

        // Enrich each schedule item with classroom data
        const enrichedSchedule = schedule.map((item) => {
          const classroom = classrooms.find(c => c._id === item.roomId);
          return {
            ...item,
            roomType: classroom?.type?.toLowerCase() || 'unknown',
            roomName: classroom?.name || 'Unknown Room',
          };
        });

        setClassrooms(classrooms);
        setSchedule(enrichedSchedule);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData();
  }, []);


  // ✍️ Save (create/update) schedule
  const saveSchedule = async (scheduleItem) => {
    try {
      let res;
      if (editingItem) {
        res = await fetch(`/api/schedule/${editingItem._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(scheduleItem),
        });
      } else {
        res = await fetch('/api/schedule', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(scheduleItem),
        });
      }

      if (!res.ok) throw new Error('Failed to save schedule');
      const savedItem = await res.json();
      const enrichedItem = enrichScheduleItem(savedItem, classrooms);

      if (editingItem) {
        setSchedule((prev) =>
          prev.map((item) => (item._id === enrichedItem._id ? enrichedItem : item))
        );
      } else {
        setSchedule((prev) => [...prev, enrichedItem]);
      }

      setIsDialogOpen(false);
      resetFormState();
    } catch (error) {
      console.error(error);
      alert('Error saving schedule');
    }
  };

  // 🗑️ Delete schedule item
  const deleteSchedule = async (id) => {
    try {
      const res = await fetch(`/api/schedule/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete schedule');
      setSchedule((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error(error);
      alert('Error deleting schedule');
    }
  };

  const roomTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'classroom', label: 'Classroom' },
    { value: 'auditorium', label: 'Auditorium' },
    { value: 'lab', label: 'Laboratory' },
    { value: 'conference', label: 'Conference Room' },
  ];

  const filteredSchedule = schedule.filter((item) => {
    const matchesSearch =
      (item.subject?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item.faculty?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item.roomName?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.roomType === filterType;
    const matchesDate = filterDate === '' || item.date === filterDate;
    return matchesSearch && matchesType && matchesDate;
  });

  const resetFormState = () => {
    setEditingItem(null);
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Track Resources</h1>
          <p className="text-gray-400">Monitor and manage classroom schedules and resource utilization</p>
        </div>

        <Button
          onClick={() => {
            setEditingItem(null);
            setIsDialogOpen(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 w-full md:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Schedule
        </Button>
      </motion.div>

      <ScheduleForm
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        classrooms={classrooms}
        schedule={schedule}
        onSave={saveSchedule}
        onDelete={deleteSchedule}
      />

      <ResourceStats schedule={filteredSchedule} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4 mb-6"
      >
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by subject, faculty, room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-4">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {roomTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full md:w-[180px]"
          />
        </div>
      </motion.div>

      <ScheduleList
        schedule={filteredSchedule}
        setSchedule={setSchedule}
        setEditingItem={setEditingItem}
        setIsDialogOpen={setIsDialogOpen}
      />
    </div>
  );
};

export default TrackResources;
