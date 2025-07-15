import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Flame,
  Bell,
  LogOut,
  AlertTriangle,
  XCircle,
  StopCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Helmet } from 'react-helmet-async';

const StudentDashboard = ({ user, onLogout, initialMessages }) => {
  const [notifications, setNotifications] = useState(initialMessages || []);
  const [alarmPlaying, setAlarmPlaying] = useState(false);
  const [showFireAlertBox, setShowFireAlertBox] = useState(false);
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [fireAlertMessage, setFireAlertMessage] = useState(null);
  const [expandedNotificationId, setExpandedNotificationId] = useState(null);
  const [playError, setPlayError] = useState(false);
  const alarmAudioRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    const pollAlarmStatus = async () => {
      try {
        const res = await fetch('http://localhost:8005/api/alarm-status');
        const data = await res.json();
        setIsAlarmActive(data.isActive);

        const latestFireAlert = notifications.find(msg => msg.type === 'Fire Alert');

        if (data.isActive && !alarmPlaying && latestFireAlert && alarmAudioRef.current) {
          setFireAlertMessage(latestFireAlert);
          alarmAudioRef.current.loop = true;
          try {
            await alarmAudioRef.current.play();
            setAlarmPlaying(true);
            setPlayError(false);
            setShowFireAlertBox(true);
          } catch (err) {
            console.warn('Autoplay blocked. Awaiting user interaction.', err);
            setPlayError(true);
          }
        } else if (!data.isActive && alarmPlaying && alarmAudioRef.current) {
          alarmAudioRef.current.pause();
          alarmAudioRef.current.currentTime = 0;
          setAlarmPlaying(false);
          setShowFireAlertBox(false);
        }
      } catch (err) {
        console.error('Failed to fetch alarm status:', err);
      }
    };

    const interval = setInterval(pollAlarmStatus, 5000);
    pollAlarmStatus();
    return () => clearInterval(interval);
  }, [alarmPlaying, notifications]);

  const handleStopAlarm = async () => {
    try {
      if (alarmAudioRef.current) {
        alarmAudioRef.current.pause();
        alarmAudioRef.current.currentTime = 0;
      }
      await fetch('http://localhost:8005/api/alarm-off', { method: 'POST' });
      setAlarmPlaying(false);
      setShowFireAlertBox(false);
      setIsAlarmActive(false);
    } catch (err) {
      console.error('Error stopping alarm:', err);
    }
  };

  const handleLogout = () => {
    window.location.href = 'http://localhost:5180/';
  };

  const handleNotificationClick = (id) => {
    setExpandedNotificationId(expandedNotificationId === id ? null : id);
  };

  const getMessageIcon = (type) => {
    switch (type) {
      case 'Fire Alert':
        return <AlertTriangle className="h-5 w-5 text-red-400" />;
      case 'Emergency Drill':
        return <Bell className="h-5 w-5 text-yellow-400" />;
      default:
        return <Bell className="h-5 w-5 text-blue-400" />;
    }
  };

  const getMessageColor = (type) => {
    switch (type) {
      case 'Fire Alert':
        return 'border-red-500/50 bg-red-500/10';
      case 'Emergency Drill':
        return 'border-yellow-500/50 bg-yellow-500/10';
      default:
        return 'border-blue-500/50 bg-blue-500/10';
    }
  };

  return (
    <>
      <Helmet>
        <title>Student Dashboard - Fire Alert System</title>
      </Helmet>

      <audio ref={alarmAudioRef} src="/sounds/alarm.mp3" preload="auto" />

      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-slate-900 to-orange-800 fire-glow flex flex-col justify-between">
        <div>
          <header className="bg-slate-800/50 border-b border-orange-400 px-6 py-4 z-10 relative flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-orange-500/20">
                <Flame className="h-6 w-6 text-orange-400" />
              </div>
              <span className="text-xl font-bold text-orange-200">Fire Alert System</span>
            </div>
            <div className="flex items-center space-x-4">
              {isAlarmActive && (
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={handleStopAlarm}>
                  <StopCircle className="mr-2 h-4 w-4" /> Stop Alarm
                </Button>
              )}
              <span className="text-sm text-orange-100">
                Logged in as: <span className="text-orange-300 font-medium">{user.username}</span> (student)
              </span>
              <Button onClick={handleLogout} variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700">
                <LogOut className="mr-2 h-4 w-4" /> Back to Dashboard
              </Button>
            </div>
          </header>

          {isAlarmActive && showFireAlertBox && fireAlertMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flashing-fire-alert z-50 flex flex-col items-center justify-center text-center p-6 backdrop-blur-md"
            >
              <AlertTriangle className="h-16 w-16 text-white animate-blink mb-4" />
              <h2 className="text-4xl font-bold text-white mb-2">{fireAlertMessage.title}</h2>
              <p className="text-lg text-white mb-6 max-w-xl">{fireAlertMessage.content}</p>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-red-700" onClick={() => setShowFireAlertBox(false)}>
                <XCircle className="mr-2 h-5 w-5" /> Close Alert & View Dashboard
              </Button>
              {playError && (
                <Button
                  className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white"
                  onClick={() => {
                    const audio = alarmAudioRef.current;
                    if (audio) {
                      audio.play()
                        .then(() => {
                          setAlarmPlaying(true);
                          setPlayError(false);
                        })
                        .catch(err => console.error('Playback failed:', err));
                    }
                  }}
                >
                  🔊 Tap to Play Alarm
                </Button>
              )}
            </motion.div>
          )}

          {!showFireAlertBox && (
            <main className="container mx-auto px-6 py-8 z-0">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-orange-200 mb-8 text-center">Student Dashboard</h1>
                <Card className="glass-effect fire-glow border border-orange-400/40 bg-slate-800/30">
                  <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center text-orange-200">
                      <Bell className="mr-2 h-6 w-6" /> Notifications
                    </CardTitle>
                    <CardDescription className="text-orange-100/70">
                      Stay updated with the latest alerts and announcements.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {notifications.length === 0 ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                        <Bell className="h-16 w-16 text-orange-300/50 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-orange-200 mb-2">No new notifications right now.</h3>
                        <p className="text-orange-300/60">Stay tuned for updates!</p>
                      </motion.div>
                    ) : (
                      <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto p-1">
                        {notifications.map((notification, index) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleNotificationClick(notification.id)}
                            className={`p-4 rounded-lg border cursor-pointer ${getMessageColor(notification.type)} hover:bg-orange-900/20`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 mt-1">{getMessageIcon(notification.type)}</div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                  <span className="text-sm font-medium text-orange-400">{notification.type}</span>
                                  <span className="text-xs text-orange-100/70">{new Date(notification.timestamp).toLocaleString()}</span>
                                </div>
                                <h4 className="font-semibold text-white mb-2">{notification.title}</h4>
                                {expandedNotificationId === notification.id && (
                                  <p className="text-sm text-orange-100/90">{notification.content}</p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </main>
          )}
        </div>

        <footer className="text-center py-6 mt-10 text-orange-200/70">
          <p className="text-sm">© 2025 SCMS. All rights reserved.</p>
          <p className="text-xs mt-1">Stay Safe. Stay Alert.</p>
        </footer>
      </div>
    </>
  );
};

export default StudentDashboard;
