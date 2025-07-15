import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, Users, MapPin, Edit, CheckCircle, XCircle, AlertTriangle, Search, Filter } from 'lucide-react';

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'available', label: 'Available', color: 'text-green-400', icon: CheckCircle },
  { value: 'occupied', label: 'Occupied', color: 'text-red-400', icon: XCircle },
  { value: 'maintenance', label: 'Maintenance', color: 'text-yellow-400', icon: AlertTriangle }
];

const roomTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'classroom', label: 'Classroom' },
  { value: 'auditorium', label: 'Auditorium' },
  { value: 'lab', label: 'Laboratory' },
  { value: 'conference', label: 'Conference Room' }
];

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

const getStatusIcon = (statusValue) => {
  const option = statusOptions.find(opt => opt.value === statusValue);
  if (option && option.icon) {
    const Icon = option.icon;
    return <Icon className={`h-4 w-4 ${option.color}`} />;
  }
  return <Building className="h-4 w-4 text-gray-400" />;
};

const getTypeIcon = (type) => {
  switch (type) {
    case 'auditorium':
      return <Users className="h-5 w-5" />;
    case 'lab':
      return <MapPin className="h-5 w-5" />;
    default:
      return <Building className="h-5 w-5" />;
  }
};

const ClassroomStatusGrid = ({ classrooms, setSelectedRoom, setIsStatusDialogOpen }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredClassrooms = classrooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || room.type === filterType;
    const matchesStatus = filterStatus === 'all' || room.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  if (classrooms.length === 0) {
    return (
      <Card className="glass-effect border-gray-700">
        <CardContent className="text-center py-12">
          <Building className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">No classrooms available</p>
          <p className="text-gray-500">Contact admin to add classrooms</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
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
      </div>

      {filteredClassrooms.length === 0 ? (
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
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-600 to-teal-600 flex items-center justify-center">
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
                  
                  <Button
                    onClick={() => {
                      setSelectedRoom(room);
                      setIsStatusDialogOpen(true);
                    }}
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Update Status
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
};

export default ClassroomStatusGrid;