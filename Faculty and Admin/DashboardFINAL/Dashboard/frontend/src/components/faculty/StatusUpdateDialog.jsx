import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const statusOptions = [
  { value: 'available', label: 'Available', color: 'text-green-400', icon: CheckCircle },
  { value: 'occupied', label: 'Occupied', color: 'text-red-400', icon: XCircle },
  { value: 'maintenance', label: 'Maintenance', color: 'text-yellow-400', icon: AlertTriangle }
];

const StatusUpdateDialog = ({ isOpen, setIsOpen, selectedRoom, setClassrooms }) => {
  const { toast } = useToast();

  const handleStatusUpdate = async (roomId, newStatus) => {
    try {
      const res = await fetch(`/api/classrooms/${roomId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      const updatedRoom = await res.json();

      // Update frontend state
      setClassrooms(prev => prev.map(room => 
        room._id === roomId ? updatedRoom : room
      ));

      toast({
        title: 'Success',
        description: 'Room status updated successfully',
      });
      setIsOpen(false);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update room status',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="glass-effect border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Update Room Status</DialogTitle>
          <DialogDescription className="text-gray-400">
            Change the status of {selectedRoom?.name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {statusOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Button
                key={option.value}
                onClick={() => handleStatusUpdate(selectedRoom?._id, option.value)}
                variant="outline"
                className={`w-full justify-start border-gray-600 hover:bg-gray-700 ${
                  selectedRoom?.status === option.value ? 'border-blue-500 bg-blue-500/10' : ''
                }`}
              >
                <Icon className={`h-4 w-4 mr-3 ${option.color}`} />
                <span className="text-white">{option.label}</span>
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatusUpdateDialog;