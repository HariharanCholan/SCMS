import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Send, LogOut, MessageSquare, History, StopCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Helmet } from 'react-helmet-async';

const AdminDashboard = ({ user, onLogout, messages, updateMessages }) => {
  const [messageType, setMessageType] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [alarmActive, setAlarmActive] = useState(false);
  const [sendDisabled, setSendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const { toast } = useToast();
  const alarmRef = useRef(null);

  useEffect(() => {
    const fetchAlarmStatus = async () => {
      try {
        const res = await fetch('http://localhost:8005/api/alarm-status');
        const data = await res.json();
        setAlarmActive(data.isActive);
        if (data.isActive && alarmRef.current) {
          alarmRef.current.currentTime = 0;
          alarmRef.current.play();
        }
      } catch (err) {
        console.error('Error fetching alarm status:', err);
      }
    };
    fetchAlarmStatus();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (sendDisabled) return;

    if (!messageType || !title || !content) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields before sending the message.',
        variant: 'destructive',
      });
      return;
    }

    const newMessage = {
      id: Date.now(),
      type: messageType,
      title,
      content,
      timestamp: new Date().toISOString(),
      sender: user.username,
    };

    const updated = [newMessage, ...messages];
    updateMessages(updated);
    localStorage.setItem('fireAlarmMessages', JSON.stringify(updated));

    if (messageType === 'Fire Alert') {
      await fetch('http://localhost:8005/api/alarm-on', { method: 'POST' });
      if (alarmRef.current) {
        alarmRef.current.currentTime = 0;
        alarmRef.current.play();
        setAlarmActive(true);
      }
    }

    setMessageType('');
    setTitle('');
    setContent('');

    setSendDisabled(true);
    setCountdown(10);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setSendDisabled(false);
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    toast({
      title: 'Message Sent Successfully',
      description: `${messageType} alert has been broadcasted to all students.`,
    });
  };

  const stopAlarm = async () => {
    if (alarmRef.current) {
      alarmRef.current.pause();
      alarmRef.current.currentTime = 0;
    }
    await fetch('http://localhost:8005/api/alarm-off', { method: 'POST' });
    setAlarmActive(false);
  };

  const handleDeleteMessage = (id) => {
    const updatedMessages = messages.filter((m) => m.id !== id);
    updateMessages(updatedMessages);
    localStorage.setItem('fireAlarmMessages', JSON.stringify(updatedMessages));
    toast({ title: 'Message Deleted', description: 'The selected message has been removed.' });
  };

  const handleLogout = () => {
    window.location.href = 'http://localhost:5179/faculty/home';
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Fire Alert System</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-slate-900 to-orange-800 p-6">
        <header className="bg-slate-800/60 border border-orange-400/30 px-6 py-4 rounded-lg mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-orange-500/20 pulse-fire">
                <Flame className="h-6 w-6 text-orange-400" />
              </div>
              <span className="text-xl font-bold text-orange-200 tracking-wide">Alert System</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-orange-100">
                Logged in as: <span className="text-orange-300 font-semibold">{user.username}</span> (admin)
              </span>
              <Button onClick={handleLogout} variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700">
                <LogOut className="mr-2 h-4 w-4" /> Back to Dashboard
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto space-y-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-3xl font-bold text-orange-100 mb-6 text-center">Admin Dashboard</h1>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="glass-effect border border-orange-400/20 fire-glow">
                <CardHeader>
                  <CardTitle className="text-orange-200 flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5" /> Send New Message
                  </CardTitle>
                  <CardDescription className="text-orange-100/70">
                    Broadcast alerts and announcements to students.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSendMessage} className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-orange-100">Message Type</Label>
                      <Select
                        value={messageType}
                        onValueChange={(val) => {
                          setMessageType(val);
                          setContent(val === 'Fire Alert' ? 'EMERGENCY EVACUATION!!!!' : '');
                        }}
                      >
                        <SelectTrigger className="bg-slate-800/40 border-orange-300/30 text-white">
                          <SelectValue placeholder="Select Message Type" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-orange-400/30">
                          {['Fire Alert', 'Emergency Drill', 'Safety Notice', 'General Announcement'].map((type) => (
                            <SelectItem key={type} value={type} className="text-white hover:bg-orange-600/20">
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-orange-100">Title</Label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-slate-800/40 border-orange-300/30 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-orange-100">Content</Label>
                      <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="bg-slate-800/40 border-orange-300/30 text-white min-h-[120px]"
                      />
                    </div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="submit"
                        disabled={sendDisabled}
                        className="w-full fire-gradient hover:opacity-90 text-white font-semibold py-3"
                      >
                        <Send className="mr-2 h-4 w-4" /> {sendDisabled ? `Wait ${countdown}s` : 'Send Message'}
                      </Button>
                    </motion.div>
                  </form>
                  <audio ref={alarmRef} src="/sounds/alarm.mp3" loop preload="auto" />
                  {alarmActive && (
                    <div className="mt-4">
                      <Button variant="destructive" onClick={stopAlarm} className="w-full bg-red-700 hover:bg-red-800">
                        <StopCircle className="mr-2 h-4 w-4" /> Stop Alarm
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="glass-effect border border-orange-400/20 fire-glow">
                <CardHeader>
                  <CardTitle className="text-orange-200 flex items-center">
                    <History className="mr-2 h-5 w-5" /> Sent Messages Log
                  </CardTitle>
                  <CardDescription className="text-orange-100/70">
                    History of all broadcasted messages.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {messages.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-orange-300">No messages sent yet.</p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-4 bg-slate-800/50 rounded-lg border border-orange-300/20"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="text-sm font-medium text-orange-400">{message.type}</span>
                              <div className="text-xs text-orange-200/70">
                                {new Date(message.timestamp).toLocaleString()}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteMessage(message.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <h4 className="font-semibold text-white mb-1">{message.title}</h4>
                          <p className="text-sm text-orange-100/90 line-clamp-2">{message.content}</p>
                        </motion.div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </main>

        <footer className="text-center py-6 mt-10 text-orange-200/70">
          <p className="text-sm">© 2025 SCMS. All rights reserved.</p>
          <p className="text-xs mt-1">Stay Safe. Stay Alert.</p>
        </footer>
      </div>
    </>
  );
};

export default AdminDashboard;
