import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import AttendanceSystem from '@/components/AttendanceSystem';
import DailyAttendance from '@/components/DailyAttendance';
import AttendanceHistory from '@/components/AttendanceHistory';
import AbsenteeList from '@/components/AbsenteeList';
import CurrentDayAttendance from '@/components/CurrentDayAttendance'; // ✅ NEW
import { Toaster } from '@/components/ui/toaster';
import { useToast } from "@/components/ui/use-toast";

function App() {
  const [activeTab, setActiveTab] = useState('attendance'); // Main navigation tab
  const [activeAttendanceView, setActiveAttendanceView] = useState('main'); // Sub-view within attendance
  const { toast } = useToast();

  const handleFeatureClick = (featureId) => {
    if (featureId === 'daily') {
      setActiveAttendanceView('dailyAttendance');
    } else if (featureId === 'history') {
      setActiveAttendanceView('attendanceHistory');
    } else if (featureId === 'absentee') {
      setActiveAttendanceView('absenteeList');
    } else if (featureId === 'currentDay') {
      setActiveAttendanceView('currentDayAttendance'); // ✅ New case
    } else {
      toast({
        title: "Feature Clicked",
        description: `You clicked on ${featureId}. This feature is under development.`,
      });
    }
  };

  const renderContent = () => {
    if (activeTab === 'attendance') {
      switch (activeAttendanceView) {
        case 'main':
          return <AttendanceSystem onFeatureClick={handleFeatureClick} setActiveAttendanceView={setActiveAttendanceView} />;
        case 'dailyAttendance':
          return <DailyAttendance setActiveAttendanceView={setActiveAttendanceView} />;
        case 'attendanceHistory':
          return <AttendanceHistory setActiveAttendanceView={setActiveAttendanceView} />;
        case 'absenteeList':
          return <AbsenteeList setActiveAttendanceView={setActiveAttendanceView} />;
        case 'currentDayAttendance': // ✅ New case
          return <CurrentDayAttendance setActiveAttendanceView={setActiveAttendanceView} />;
        default:
          return <AttendanceSystem onFeatureClick={handleFeatureClick} setActiveAttendanceView={setActiveAttendanceView} />;
      }
    }

    // Fallback for future tabs
    return <AttendanceSystem onFeatureClick={handleFeatureClick} setActiveAttendanceView={setActiveAttendanceView} />;
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation
        activeTab={activeTab}
        setActiveTab={(tabId) => {
          setActiveTab(tabId);
          setActiveAttendanceView('main'); // Reset view when tab changes
        }}
      />
      {renderContent()}
      <Toaster />
    </div>
  );
}

export default App;
