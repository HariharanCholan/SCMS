import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  History,
  ListChecks,
  UserCheck,
  Clock,
  FileDown,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { Packer } from 'docx';
import { saveAs } from 'file-saver';
import { generateDocx } from '@/lib/docx-generator';

const AttendanceSystem = ({ onFeatureClick }) => {
  const { toast } = useToast();
  const [dailyData, setDailyData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [absenteeData, setAbsenteeData] = useState([]);
  const [currentDayData, setCurrentDayData] = useState(null);

  const getToday = () => new Date().toISOString().split('T')[0];

  const getAbsentees = (data) => {
    const absenceMap = {};
    data.forEach(record => {
      if (record.status === 'Absent') {
        const studentName = record.student?.name || 'Unknown';
        absenceMap[studentName] = (absenceMap[studentName] || 0) + 1;
      }
    });
    return Object.entries(absenceMap).map(([student, absences]) => ({
      student,
      absences
    }));
  };

  useEffect(() => {
    const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8003';
    console.log('🔍 VITE_BACKEND_URL:', base);
    const fetchAll = async () => {
      try {
        const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8003';
        console.log("🔍 Fetching from:", base);

        const [attendanceRes, todayRes] = await Promise.all([
          fetch(`${base}/api/attendance`),
          fetch(`${base}/api/attendance/today`)
        ]);

        if (!attendanceRes.ok) {
          throw new Error(`Attendance fetch failed: ${attendanceRes.statusText}`);
        }

        const allAttendance = await attendanceRes.json();
        let todayAttendance = null;

        if (todayRes.ok) {
          todayAttendance = await todayRes.json();
        } else {
          const errorText = await todayRes.text(); // Don't parse as JSON
          console.warn("⚠️ Today fetch not OK:", todayRes.status, errorText);
          toast({
            title: "No Attendance Today",
            description: "No attendance session was found for today.",
          });
        }

        setDailyData(allAttendance.filter(record => record.date === getToday()));
        setHistoryData(allAttendance);
        setAbsenteeData(getAbsentees(allAttendance));
        setCurrentDayData(todayAttendance);

      } catch (err) {
        console.error('❌ Fetch error:', err);
        toast({
          variant: "destructive",
          title: "Failed to load attendance data",
          description: err.message,
        });
      }
    };

    fetchAll();
  }, []);

  const downloadData = async (title, data) => {
    try {
      const doc = generateDocx(title, data);
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${title.toLowerCase().replace(/\s+/g, '_')}_data.docx`);
      toast({
        title: "Download Started",
        description: `${title} data is being downloaded as a DOCX file.`,
      });
    } catch (error) {
      console.error("Error generating DOCX:", error);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: `Could not generate DOCX for ${title}.`,
      });
    }
  };

  const features = [
    {
      id: 'daily',
      title: 'Daily Attendance',
      description: 'Mark student attendance',
      icon: Calendar,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      action: () => onFeatureClick('daily'),
      downloadAction: () => downloadData('Daily Attendance Summary', dailyData)
    },
    {
      id: 'history',
      title: 'Attendance History',
      description: 'View full attendance records',
      icon: History,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      action: () => onFeatureClick('history'),
      downloadAction: () => downloadData('Attendance History Summary', historyData)
    },
    {
      id: 'absentee',
      title: 'Absentee List',
      description: 'Track students with low attendance',
      icon: ListChecks,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      action: () => onFeatureClick('absentee'),
      downloadAction: () => downloadData('Absentee List Summary', absenteeData)
    },
    {
      id: 'currentDay',
      title: 'Current Day Attendance',
      description: 'Today’s present & absent students',
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      action: () => onFeatureClick('currentDay'),
      downloadAction: () => {
        if (!currentDayData) {
          toast({
            variant: 'destructive',
            title: 'No data',
            description: 'No attendance found for today.',
          });
          return;
        }

        const combined = [
          ...(currentDayData.present || []).map(p => ({
            fingerId: p.fingerId,
            name: p.name,
            status: 'Present',
            timestamp: new Date(p.timestamp).toLocaleString()
          })),
          ...(currentDayData.absent || []).map(a => ({
            fingerId: a.fingerId,
            name: a.name,
            status: 'Absent',
            timestamp: 'N/A'
          }))
        ];

        downloadData('Current Day Attendance', combined);
      }
    }
  ];

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Attendance Management
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Track and manage student attendance efficiently.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="card-hover h-full flex flex-col"
              >
                <Card
                  className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm h-full flex flex-col justify-between cursor-pointer"
                  onClick={feature.action}
                >
                  <CardContent className="p-8 text-center flex-grow">
                    <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                      <Icon className={`w-8 h-8 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400">
                      {feature.description}
                    </p>
                  </CardContent>
                  <div className="p-4 border-t border-slate-700/50">
                    <Button
                      variant="ghost"
                      className="w-full text-green-400 hover:text-green-300 hover:bg-green-500/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        feature.downloadAction();
                      }}
                    >
                      <FileDown className="w-4 h-4 mr-2" />
                      Download Data
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default AttendanceSystem;
