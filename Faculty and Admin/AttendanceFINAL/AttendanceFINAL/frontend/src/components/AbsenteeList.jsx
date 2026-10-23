import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, ListChecks, FileDown, UserX } from 'lucide-react';
import { Packer } from 'docx';
import { saveAs } from 'file-saver';
import { generateDocx } from '@/lib/docx-generator';

const AbsenteeList = ({ setActiveAttendanceView }) => {
  const [sessions, setSessions] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAbsentees = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/attendance/absentees/sessions');
        const data = await res.json();

        if (!data.success || !Array.isArray(data.sessions)) {
          throw new Error(data.message || "Failed to fetch absentee sessions");
        }

        setSessions(data.sessions);
      } catch (error) {
        console.error('❌ Error fetching absentee sessions:', error);
        toast({
          variant: "destructive",
          title: "Fetch Failed",
          description: "Unable to retrieve absentee session data.",
        });
      }
    };

    fetchAbsentees();
  }, [toast]);

  const downloadSessionAbsentees = async (session) => {
    try {
      const doc = generateDocx(
        `Absentees - ${new Date(session.sessionStart).toLocaleString()}`,
        session.absentees.map(a => ({
          name: a.name,
          fingerId: a.fingerId,
          status: a.status,
          sessionDate: new Date(session.sessionStart).toLocaleDateString()
        }))
      );

      const blob = await Packer.toBlob(doc);
      const fileName = `absentees_${new Date(session.sessionStart).toISOString().replace(/[:.]/g, '-')}.docx`;
      saveAs(blob, fileName);

      toast({
        title: "Download Started",
        description: `Downloading DOCX for ${new Date(session.sessionStart).toLocaleString()}.`,
      });
    } catch (error) {
      console.error("❌ Error generating DOCX:", error);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Could not generate DOCX file.",
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
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Attendance Menu
        </Button>

        <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-md shadow-2xl">
          <CardHeader className="border-b border-slate-700/50">
            <div className="flex items-center space-x-3">
              <ListChecks className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl font-bold text-white">Absentees Per Session</CardTitle>
            </div>
            <p className="text-slate-400 pt-2">Lists students absent in each past session.</p>
          </CardHeader>

          <CardContent className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {sessions.length === 0 ? (
              <p className="text-center text-slate-400 py-8">No absentee session data available.</p>
            ) : (
              sessions.map((session, i) => (
                <motion.div
                  key={session.sessionId || i}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50"
                >
                  <p className="text-slate-100 font-medium mb-2">
                    Session Date: {new Date(session.sessionStart).toLocaleString()}
                  </p>
                  {session.absentees.length === 0 ? (
                    <p className="text-slate-400 text-sm italic">No absentees in this session.</p>
                  ) : (
                    session.absentees.map((a, j) => (
                      <div key={j} className="flex justify-between items-center mb-2">
                        <div>
                          <p className="text-white font-semibold">{a.name}</p>
                          <p className="text-slate-400 text-sm">Finger ID: {a.fingerId}</p>
                        </div>
                        <div className="flex items-center text-red-400">
                          <UserX className="h-4 w-4 mr-1" />
                          <span>Absent</span>
                        </div>
                      </div>
                    ))
                  )}
                  <div className="mt-4">
                    <Button
                      onClick={() => downloadSessionAbsentees(session)}
                      variant="outline"
                      className="w-full text-primary border-primary hover:bg-primary/10"
                      disabled={session.absentees.length === 0}
                    >
                      <FileDown className="mr-2 h-4 w-4" /> Download Session Absentees
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

export default AbsenteeList;
