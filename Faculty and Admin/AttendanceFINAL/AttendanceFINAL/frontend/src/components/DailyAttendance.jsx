import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { saveAs } from 'file-saver';
import { Packer } from 'docx';
import { generateDocx } from '../lib/docx-generator';
import { useToast } from './ui/use-toast';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import {
  ArrowLeft,
  UserCheck,
  FileDown,
  Search,
  Calendar
} from 'lucide-react';

const DailyAttendance = ({ setActiveAttendanceView }) => {
  const [studentsData, setStudentsData] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const { toast } = useToast();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch('http://localhost:8003/api/students');
        if (!res.ok) throw new Error('Failed to fetch students');
        const students = await res.json();
        setStudentsData(students);
        const initialAttendance = {};
        students.forEach(student => {
          initialAttendance[student._id] = false;
        });
        setAttendance(initialAttendance);
      } catch (error) {
        console.error("Error fetching students:", error);
        toast({
          variant: "destructive",
          title: "Fetch Error",
          description: "Could not fetch students from the server.",
        });
      }
    };
    fetchStudents();
  }, [toast]);

  const filteredStudents = useMemo(() =>
    studentsData.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm, studentsData]);

  const allFilteredSelected = useMemo(() =>
    filteredStudents.length > 0 &&
    filteredStudents.every(student => attendance[student._id]),
    [filteredStudents, attendance]);

  const handleAttendanceChange = (studentId, checked) => {
    setAttendance(prev => ({ ...prev, [studentId]: checked === true }));
  };

  const handleSelectAll = (checked) => {
    setAttendance(prev => {
      const updated = { ...prev };
      filteredStudents.forEach(student => {
        updated[student._id] = checked === true;
      });
      return updated;
    });
  };

  const handleSubmitAttendance = async () => {
    const marked = studentsData.map(student => ({
      name: student.name,
      status: attendance[student._id] ? 'Present' : 'Absent'
    }));

    const payload = {
      date: selectedDate,
      records: marked
    };

    try {
      const res = await fetch('http://localhost:8003/api/attendance/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to submit attendance');

      toast({
        title: "Attendance Submitted",
        description: `Attendance for ${selectedDate} has been saved.`,
      });
      setActiveAttendanceView('main');
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "Failed to save attendance. Please try again.",
      });
    }
  };

  const downloadVisibleData = async () => {
    if (filteredStudents.length === 0) {
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "No visible students to download.",
      });
      return;
    }

    const records = filteredStudents.map(student => ({
      name: student.name,
      status: attendance[student._id] ? 'Present' : 'Absent',
    }));

    try {
      const doc = generateDocx({
        title: `Visible Attendance - ${selectedDate}`,
        date: selectedDate,
        records,
      });
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `visible_attendance_${selectedDate}.docx`);
      toast({
        title: "Download Started",
        description: "Visible attendance file is downloading.",
      });
    } catch (error) {
      console.error("DOCX error:", error);
      toast({
        variant: "destructive",
        title: "Download Error",
        description: "Failed to generate DOCX file.",
      });
    }
  };

  const handleDownloadDocx = async () => {
    if (studentsData.length === 0) {
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "No attendance data to download.",
      });
      return;
    }

    const records = studentsData.map(student => ({
      name: student.name,
      status: attendance[student._id] ? 'Present' : 'Absent',
    }));

    try {
      const doc = generateDocx({
        title: `Manual Attendance - ${selectedDate}`,
        date: selectedDate,
        records,
      });
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `attendance_${selectedDate}.docx`);
      toast({
        title: "Download Started",
        description: "Your attendance file is being downloaded.",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Could not create DOCX file.",
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
              <UserCheck className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl font-bold text-white">Mark Manual Attendance</CardTitle>
            </div>
            <div className="pt-4 flex items-center gap-4">
              <Label className="text-slate-300 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Select Date:
              </Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-[160px] bg-slate-700/30 border-slate-600 text-white"
              />
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-grow w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search student name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700/30 border-slate-600 text-white w-full"
                />
              </div>
              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <Checkbox
                  id="select-all"
                  checked={allFilteredSelected}
                  onCheckedChange={(checked) => handleSelectAll(checked)}
                  disabled={filteredStudents.length === 0}
                  className="h-5 w-5 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-slate-500"
                />
                <Label htmlFor="select-all" className="text-slate-300 cursor-pointer">
                  {allFilteredSelected ? "Deselect All Visible" : "Select All Visible"}
                </Label>
              </div>
            </div>

            <div className="max-h-[45vh] overflow-y-auto space-y-4 pr-2">
              {filteredStudents.map((student, index) => (
                <motion.div
                  key={student._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
                >
                  <Label htmlFor={`student-${student._id}`} className="text-lg text-slate-200 cursor-pointer">
                    {student.name}
                  </Label>
                  <Checkbox
                    id={`student-${student._id}`}
                    checked={!!attendance[student._id]}
                    onCheckedChange={(checked) => handleAttendanceChange(student._id, checked)}
                    className="h-6 w-6 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-slate-500"
                  />
                </motion.div>
              ))}
              {filteredStudents.length === 0 && searchTerm && (
                <p className="text-center text-slate-400 py-8">No students match your search.</p>
              )}
              {studentsData.length === 0 && (
                <p className="text-center text-slate-400 py-8">No students found. Add students to mark attendance.</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="border-t border-slate-700/50 p-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-between">
              <Button
                onClick={downloadVisibleData}
                variant="outline"
                className="w-full sm:w-auto text-primary border-primary hover:bg-primary/10 hover:text-primary"
                disabled={filteredStudents.length === 0}
              >
                <FileDown className="mr-2 h-4 w-4" /> Download Visible as DOCX
              </Button>
              <Button
                onClick={handleDownloadDocx}
                variant="outline"
                className="w-full sm:w-auto text-primary border-primary hover:bg-primary/10 hover:text-primary"
                disabled={studentsData.length === 0}
              >
                <FileDown className="mr-2 h-4 w-4" /> Download All as DOCX
              </Button>
              <Button
                onClick={handleSubmitAttendance}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg"
                disabled={studentsData.length === 0}
              >
                Submit Attendance
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default DailyAttendance;
