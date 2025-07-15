
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Globe, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    name: 'Dr. John Smith',
    email: 'john.smith@university.edu',
    department: 'Computer Science',
    notifications: 'all',
    theme: 'dark',
    language: 'english',
    timezone: 'UTC-5'
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const settingsCards = [
    {
      icon: User,
      title: "Profile Settings",
      description: "Manage your personal information",
      color: "from-blue-500 to-blue-600",
      content: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-gray-300">Full Name</Label>
            <Input
              id="name"
              value={settings.name}
              onChange={(e) => setSettings({...settings, name: e.target.value})}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <Input
              id="email"
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({...settings, email: e.target.value})}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
          <div>
            <Label htmlFor="department" className="text-gray-300">Department</Label>
            <Input
              id="department"
              value={settings.department}
              onChange={(e) => setSettings({...settings, department: e.target.value})}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
        </div>
      )
    },
    {
      icon: Bell,
      title: "Notification Preferences",
      description: "Configure your notification settings",
      color: "from-green-500 to-green-600",
      content: (
        <div className="space-y-4">
          <div>
            <Label className="text-gray-300">Notification Level</Label>
            <Select value={settings.notifications} onValueChange={(value) => setSettings({...settings, notifications: value})}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all">All Notifications</SelectItem>
                <SelectItem value="important">Important Only</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    },
    {
      icon: Palette,
      title: "Appearance",
      description: "Customize your interface",
      color: "from-purple-500 to-purple-600",
      content: (
        <div className="space-y-4">
          <div>
            <Label className="text-gray-300">Theme</Label>
            <Select value={settings.theme} onValueChange={(value) => setSettings({...settings, theme: value})}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    },
    {
      icon: Globe,
      title: "Regional Settings",
      description: "Language and timezone preferences",
      color: "from-orange-500 to-orange-600",
      content: (
        <div className="space-y-4">
          <div>
            <Label className="text-gray-300">Language</Label>
            <Select value={settings.language} onValueChange={(value) => setSettings({...settings, language: value})}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
                <SelectItem value="french">French</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-gray-300">Timezone</Label>
            <Select value={settings.timezone} onValueChange={(value) => setSettings({...settings, timezone: value})}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="UTC-5">UTC-5 (Eastern)</SelectItem>
                <SelectItem value="UTC-6">UTC-6 (Central)</SelectItem>
                <SelectItem value="UTC-7">UTC-7 (Mountain)</SelectItem>
                <SelectItem value="UTC-8">UTC-8 (Pacific)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your preferences and account settings</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingsCards.map((setting, index) => (
          <motion.div
            key={setting.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="glass-effect border-gray-700 h-full">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${setting.color} flex items-center justify-center`}>
                    <setting.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white">{setting.title}</CardTitle>
                    <CardDescription className="text-gray-400">{setting.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {setting.content}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex justify-end"
      >
        <Button 
          onClick={handleSave}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
        >
          <Save className="w-5 h-5 mr-2" />
          Save All Settings
        </Button>
      </motion.div>
    </div>
  );
};

export default Settings;
