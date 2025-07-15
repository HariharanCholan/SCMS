import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Building, Users, MapPin, Trash2, Edit, AlertTriangle, Search, Filter } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const ManageClassrooms = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const { toast } = useToast();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    capacity: '',
    location: '',
    status: 'available'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusFromQuery = params.get('status');
    if (statusFromQuery) {
      setFilterStatus(statusFromQuery);
    }
  }, [location.search]);

  // Fetch classrooms from backend API on mount
  useEffect(() => {
    const fetchClassrooms = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/classrooms');
        if (!res.ok) throw new Error('Failed to fetch classrooms');
        const data = await res.json();
        setClassrooms(data);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Could not load classrooms",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, [toast]);

  const roomTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'Classroom', label: 'Classroom' },
    { value: 'Auditorium', label: 'Auditorium' },
    { value: 'Lab', label: 'Laboratory' },
    { value: 'Conference', label: 'Conference Room' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'available', label: 'Available' },
    { value: 'occupied', label: 'Occupied' },
    { value: 'maintenance', label: 'Maintenance' }
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      capacity: '',
      location: '',
      status: 'available'
    });
    setEditingRoom(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.type || !formData.capacity || !formData.location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const classroomPayload = {
      ...formData,
      capacity: parseInt(formData.capacity),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingRoom) {
      // For update keep createdAt from editingRoom
      classroomPayload.createdAt = editingRoom.createdAt;
      try {
        const res = await fetch(`/api/classrooms/${editingRoom._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(classroomPayload),
        });
        if (!res.ok) throw new Error('Failed to update classroom');
        const updatedClassroom = await res.json();
        setClassrooms(prev => prev.map(room => room._id === editingRoom._id ? updatedClassroom : room));
        toast({
          title: "Success",
          description: "Classroom updated successfully"
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Update failed",
          variant: "destructive"
        });
        return;
      }
    } else {
      // Create new classroom: add createdAt and generate ID on backend ideally
      classroomPayload.createdAt = new Date().toISOString();
      try {
        const res = await fetch('/api/classrooms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(classroomPayload),
        });
        if (!res.ok) throw new Error('Failed to create classroom');
        const newClassroom = await res.json();
        setClassrooms(prev => [...prev, newClassroom]);
        toast({
          title: "Success",
          description: "Classroom created successfully"
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Creation failed",
          variant: "destructive"
        });
        return;
      }
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      type: room.type,
      capacity: room.capacity.toString(),
      location: room.location,
      status: room.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (_id) => {
    console.log("Deleting classroom with ID:", _id);
    try {
      const res = await fetch(`/api/classrooms/${_id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete classroom');
      setClassrooms(prev => prev.filter(room => room._id !== _id));
      toast({
        title: "Success",
        description: "Classroom deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Delete failed",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available':
        return <Building className="h-4 w-4 text-green-400" />;
      case 'occupied':
        return <Users className="h-4 w-4 text-red-400" />;
      case 'maintenance':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      default:
        return <Building className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'occupied':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'maintenance':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Auditorium':
        return <Users className="h-5 w-5" />;
      case 'Lab':
        return <MapPin className="h-5 w-5" />;
      default:
        return <Building className="h-5 w-5" />;
    }
  };

  const filteredClassrooms = classrooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || room.type === filterType;
    const matchesStatus = filterStatus === 'all' || room.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Manage Classrooms</h1>
          <p className="text-gray-400">Create, edit, and manage classroom facilities</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 w-full md:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Classroom
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-effect border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>{editingRoom ? 'Edit Classroom' : 'Add New Classroom'}</DialogTitle>
              <DialogDescription className="text-gray-400">
                {editingRoom ? 'Update classroom details' : 'Create a new classroom facility'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* form fields remain unchanged */}
              <div className="space-y-2">
                <Label htmlFor="name">Classroom Name</Label>
                <Input
                  _id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Room 101, Main Auditorium"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Room Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.filter(rt => rt.value !== 'all').map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  _id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                  placeholder="Number of seats"
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  _id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Building A, Floor 2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.filter(so => so.value !== 'all').map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600">
                  {editingRoom ? 'Update' : 'Create'} Classroom
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

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
            placeholder="Search by room name..."
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
              {roomTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(status => (
                <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {loading ? (
          <p className="text-center text-gray-400">Loading classrooms...</p>
        ) : filteredClassrooms.length === 0 ? (
          <Card className="glass-effect border-gray-700">
            <CardContent className="text-center py-12">
              <Building className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">No classrooms match your criteria</p>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClassrooms.map((room, index) => (
              <motion.div
                key={room._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card className="glass-effect border-gray-700 card-hover h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                          {getTypeIcon(room.type)}
                        </div>
                        <div>
                          <CardTitle className="text-white text-lg">{room.name}</CardTitle>
                          <CardDescription className="text-gray-400 capitalize">
                            {room.type}
                          </CardDescription>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(room.status)}`}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(room.status)}
                          <span className="capitalize">{room.status}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Capacity</span>
                        <span className="text-white font-medium">{room.capacity} seats</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Location</span>
                        <span className="text-white font-medium">{room.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-yellow-500 hover:bg-yellow-600 hover:text-white text-yellow-400"
                        onClick={() => handleEdit(room)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500 hover:bg-red-600 hover:text-white text-red-400"
                        onClick={() => handleDelete(room._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ManageClassrooms;
