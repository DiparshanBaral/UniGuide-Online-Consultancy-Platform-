import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAtom } from 'jotai';
import logo from '@/assets/UniGuide_logo.png';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import API from '../api';
import { sessionAtom } from '@/atoms/session';
import GoogleAuthButton from '@/Components/GoogleAuthButton';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [, setSession] = useAtom(sessionAtom);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response = await attemptAdminLogin(email, password);

      if (response?.data?.token) {
        handleSuccessfulLogin(response.data, 'admin');
        return;
      }

      response = await attemptStudentLogin(email, password);

      if (response?.data?.token) {
        handleSuccessfulLogin(response.data, 'student');
        return;
      }

      response = await attemptMentorLogin(email, password);

      if (response?.data?.token) {
        handleSuccessfulLogin(response.data, 'mentor');
        return;
      }

      throw new Error('Invalid credentials. Please try again.');
    } catch (err) {
      toast.error(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const attemptAdminLogin = async (email, password) => {
    try {
      const response = await API.post('/admin/login', { email, password });
      return response;
      // eslint-disable-next-line no-unused-vars
    } catch (adminError) {
      return null;
    }
  };

  const attemptStudentLogin = async (email, password) => {
    try {
      const response = await API.post('/student/login', { email, password });
      return response;
      // eslint-disable-next-line no-unused-vars
    } catch (studentError) {
      return null;
    }
  };

  const attemptMentorLogin = async (email, password) => {
    try {
      const response = await API.post('/mentor/login', { email, password });
      return response;
      // eslint-disable-next-line no-unused-vars
    } catch (mentorError) {
      return null;
    }
  };

  const handleSuccessfulLogin = (user, role) => {
    if (!user || !user.token) {
      throw new Error('Invalid response from server. User data is missing.');
    }

    let sessionData = {
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: role,
      token: user.token,
      profilePic: user.profilePic,
    };

    if (role === 'admin') {
      sessionData = { role: 'admin', token: user.token };
    }

    // Save session data
    localStorage.setItem('session', JSON.stringify(sessionData));

    // Update session state
    setSession(sessionData);
    toast.success(
      role === 'admin' ? 'Welcome, Admin' : `Welcome back, ${user.firstname} ${user.lastname}`,
    );

    // Redirect based on role
    if (role === 'admin') navigate('/admin/');
    else navigate('/');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background">
      <div className="w-full max-w-md relative z-10">
        <div className="absolute inset-0 bg-white/30 rounded-2xl blur-xl -z-10 transform -rotate-3" />
        <div className="absolute inset-0 bg-white/30 rounded-2xl blur-xl -z-10 transform rotate-3" />

        <Card className="w-full border border-primary/20 shadow-xl bg-card/95">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex justify-center mb-4">
              <img src={logo || '/placeholder.svg'} alt="UniGuide Logo" className="h-16 w-auto" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="mb-4">
              <GoogleAuthButton isSignup={false} />
            </div>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-primary/20 focus-visible:ring-primary/30"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 border-primary/20 focus-visible:ring-primary/30"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-10 w-10"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">
                      {showPassword ? 'Hide password' : 'Show password'}
                    </span>
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full mt-6 transition-all hover:shadow-lg hover:shadow-primary/25"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center pb-6">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="text-primary font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>

        <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-primary/10 rounded-full blur-xl -z-10" />
        <div className="absolute -top-4 -left-4 h-20 w-20 bg-primary/10 rounded-full blur-xl -z-10" />
      </div>
    </div>
  );
}
