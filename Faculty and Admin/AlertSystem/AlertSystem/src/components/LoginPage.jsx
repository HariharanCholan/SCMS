import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const { toast } = useToast();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username || !password || !role) {
      toast({
        title: 'Missing Fields',
        description: 'Please enter all details before logging in.',
        variant: 'destructive',
      });
      return;
    }

    const userData = {
      username,
      role,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem('fireAlarmUser', JSON.stringify(userData));
    toast({
      title: 'Login Successful',
      description: `Welcome ${username}!`,
    });

    setTimeout(() => {
      onLogin(userData);
    }, 800);
  };

  return (
    <>
      <Helmet>
        <title>Fire Alert Login</title>
        <meta name="description" content="Login to Fire Alert System." />
      </Helmet>

      <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden bg-gradient-to-br from-orange-900 via-slate-900 to-orange-800">
        {/* 🔄 Dynamic shimmer overlay */}
        <div className="absolute inset-0 pointer-events-none z-0 animate-bg-motion opacity-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-md"
        >
          <Card className="glass-effect border border-orange-400/20 fire-glow shadow-xl">
            <CardHeader className="flex flex-col items-center space-y-3">
              <motion.div
                initial={{ rotate: -20 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="bg-orange-600/30 rounded-full p-3 shadow-lg pulse-fire">
                  <Flame className="h-7 w-7 text-orange-300" />
                </div>
              </motion.div>
              <CardTitle className="text-2xl text-orange-100 tracking-wide font-bold">
                Fire Alert System
              </CardTitle>
              <CardDescription className="text-sm text-orange-200/80">
                Sign in to your dashboard
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="username" className="text-sm text-orange-100">
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="bg-slate-800/40 border-orange-300/30 text-white placeholder:text-orange-200/50"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="password" className="text-sm text-orange-100">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="bg-slate-800/40 border-orange-300/30 text-white placeholder:text-orange-200/50"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-sm text-orange-100">Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="bg-slate-800/40 border-orange-300/30 text-white">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-orange-400/30">
                      <SelectItem value="admin" className="text-white hover:bg-orange-600/20">
                        Admin
                      </SelectItem>
                      <SelectItem value="student" className="text-white hover:bg-orange-600/20">
                        Student
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    className="w-full fire-gradient text-white font-semibold py-3 tracking-wide"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </motion.div>
              </form>

              <div className="text-center pt-4">
                <p className="text-xs text-orange-200/60">
                  &copy; 2025 SCMS. Stay safe.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;
