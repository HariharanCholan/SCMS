import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardHeader, CardTitle, CardFooter
} from '@/components/ui/card';
import { ArrowLeft, CalendarDays, UserCheck, UserX } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const CurrentDayAttendance = ({ setActiveAttendanceView }) => {
  const [present, setPresent] = useState([]);
  const [absent, setAbsent] = useState([]);
  const [sessionTime, setSessionTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchToday = async () => {
      try {
        const res = await fetch("http://localhost:8003/api/attendance/today");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Invalid response');

        setPresent(data.present);
        setAbsent(data.absent);
        setSessionTime(data.sessionStart);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Failed to Load",
          description: err.message || "Unable to fetch today's data."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchToday();
  }, [toast]);

  return (
    <div className="min-h-screen gradient-bg py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <Button
          variant="ghost"
          onClick={() => setActiveAttendanceView('main')}
          className="mb-6 text-slate-300 hover:text-white hover:bg-slate-700/50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Menu
        </Button>

        <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-md shadow-2xl">
          <CardHeader className="border-b border-slate-700/50">
            <div className="flex items-center space-x-3">
              <CalendarDays className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl font-bold text-white">Today's Attendance</CardTitle>
            </div>
            <p className="text-slate-400 pt-2">
              Session Time: {sessionTime ? new Date(sessionTime).toLocaleString() : 'N/A'}
            </p>
          </CardHeader>

          <CardContent className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {loading ? (
              <p className="text-center text-slate-300 py-8">Loading...</p>
            ) : (
              <>
                <div>
                  <h3 className="text-xl text-green-400 font-semibold mb-3">Present Students</h3>
                  {present.length === 0 ? (
                    <p className="text-slate-400 italic">No students marked present.</p>
                  ) : (
                    present.map((a, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-slate-700">
                        <div>
                          <p className="text-white font-medium">{a.name}</p>
                          <p className="text-slate-400 text-sm">Finger ID: {a.fingerId}</p>
                        </div>
                        <UserCheck className="text-green-400 h-5 w-5" />
                      </div>
                    ))
                  )}
                </div>

                <div>
                  <h3 className="text-xl text-red-400 font-semibold mt-6 mb-3">Absent Students</h3>
                  {absent.length === 0 ? (
                    <p className="text-slate-400 italic">No absentees found.</p>
                  ) : (
                    absent.map((a, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-slate-700">
                        <div>
                          <p className="text-white font-medium">{a.name}</p>
                          <p className="text-slate-400 text-sm">Finger ID: {a.fingerId}</p>
                        </div>
                        <UserX className="text-red-400 h-5 w-5" />
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </CardContent>

          <CardFooter className="text-xs text-slate-500 p-6 border-t border-slate-700/50">
            Total: {present.length + absent.length} | Present: {present.length} | Absent: {absent.length}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default CurrentDayAttendance;
