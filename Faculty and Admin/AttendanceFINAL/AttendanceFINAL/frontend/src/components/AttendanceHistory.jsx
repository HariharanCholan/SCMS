import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardHeader, CardTitle, CardFooter
} from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeft, Clock, FileDown,
  UserCheck, UserX
} from 'lucide-react';
import { Packer } from 'docx';
import { saveAs } from 'file-saver';
import { generateDocx } from '@/lib/docx-generator';

const AttendanceHistory = ({ setActiveAttendanceView }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/attendance/sessions");
        const data = await res.json();
        if (!res.ok || !Array.isArray(data.sessions)) throw new Error(data?.error || "Invalid response");
        setSessions(data.sessions);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Failed to Load",
          description: err.message || "Unable to fetch attendance data.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const downloadSession = async (session) => {
    if (!session?.attendees) return;

    const formattedData = session.attendees.map((a) => ({
      student_name: a.name,
      finger_id: a.fingerId,
      status: a.status,
      timestamp: new Date(a.timestamp).toLocaleString(),
    }));

    try {
      const doc = generateDocx(`Attendance - ${new Date(session.sessionStart).toLocaleString()}`, formattedData);
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `attendance_${new Date(session.sessionStart).toISOString()}.docx`);

      toast({
        title: "Download Ready",
        description: "DOCX is being downloaded.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Could not generate DOCX.",
      });
    }
  };

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
              <Clock className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl font-bold text-white">Attendance Sessions</CardTitle>
            </div>
            <p className="text-slate-400 pt-2">List of all recorded attendance sessions.</p>
          </CardHeader>

          <CardContent className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {loading ? (
              <p className="text-center text-slate-300 py-8">Loading...</p>
            ) : sessions.length === 0 ? (
              <p className="text-center text-slate-400 py-8">No sessions found.</p>
            ) : (
              sessions.map((session, i) => (
                <motion.div
                  key={session._id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50"
                >
                  <p className="text-white font-semibold mb-2">
                    Date: {new Date(session.sessionStart).toLocaleString()}
                  </p>

                  <div className="space-y-3">
                    {session.attendees.map((a, j) => (
                      <div key={j} className="flex justify-between items-center">
                        <div>
                          <p className="text-slate-100 font-medium">{a.name}</p>
                          <p className="text-slate-400 text-sm">ID: {a.fingerId}</p>
                          <p className="text-slate-500 text-xs">Time: {new Date(a.timestamp).toLocaleTimeString()}</p>
                        </div>
                        <div>
                          {a.status === "present" ? (
                            <UserCheck className="text-green-400 h-5 w-5" />
                          ) : (
                            <UserX className="text-red-400 h-5 w-5" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <Button
                      onClick={() => downloadSession(session)}
                      variant="outline"
                      className="w-full text-primary border-primary hover:bg-primary/10"
                    >
                      <FileDown className="mr-2 h-4 w-4" /> Download Session DOCX
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </CardContent>

          <CardFooter className="text-xs text-slate-500 p-6 border-t border-slate-700/50">
            Total Sessions: {sessions.length}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default AttendanceHistory;
