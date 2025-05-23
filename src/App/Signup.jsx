import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, EyeOff, UserRound, Mail, Lock } from 'lucide-react';
import logo from '@/assets/UniGuide_logo.PNG';

import { Button } from '@/Components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select';
import API from '../api';
import GoogleAuthButton from '@/Components/GoogleAuthButton';

export default function SignupForm() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for error parameters in URL when component mounts
    const queryParams = new URLSearchParams(location.search);
    const errorParam = queryParams.get('error');

    if (errorParam === 'no_account_found') {
      toast.error('You need to create an account first. Please sign up to continue.', {
        duration: 5000,
        position: 'top-center',
      });

      // Optionally clear the URL parameter after showing toast
      navigate('/signup', { replace: true });
    }
  }, [location.search, navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleRoleChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      role: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstname, lastname, email, password, confirmPassword, role } = formData;

    // Check for empty fields
    if (!firstname || !lastname || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields!');
      return;
    }

    // Validate email format - accept Gmail and educational domains
    const emailParts = email.split('@');
    const domain = emailParts.length === 2 ? emailParts[1].toLowerCase() : '';
    if (
      !(
        domain === 'gmail.com' ||
        domain.endsWith('.edu') ||
        domain.includes('.edu.') ||
        domain.includes('.org')
      )
    ) {
      toast.error('Please enter a valid Gmail address or educational email (.edu)!');
      return;
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!password.match(passwordRegex)) {
      toast.error(
        'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number.',
      );
      return;
    }

    // Ensure passwords match
    if (password.trim() !== confirmPassword.trim()) {
      toast.error('Passwords do not match!');
      return;
    }

    setLoading(true);
    try {
      // First verify the email address by sending an OTP
      const verifyResponse = await API.post('/auth/verify-email', { email });
      if (verifyResponse.status === 200) {
        // Store registration data in localStorage to use after OTP verification
        localStorage.setItem(
          'pendingRegistration',
          JSON.stringify({
            firstname,
            lastname,
            email,
            password,
            confirmPassword,
            role,
          }),
        );
        // Navigate to OTP verification page
        navigate('/verify-otp?action=signup');
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Error sending verification code. Please try again.',
      );
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background">
      <div className="relative z-10 w-full max-w-md">
        <div className="absolute inset-0 transform bg-white/30 rounded-2xl blur-xl -z-10 -rotate-3" />
        <div className="absolute inset-0 transform bg-white/30 rounded-2xl blur-xl -z-10 rotate-3" />

        <Card className="w-full border shadow-xl border-primary/20 bg-card/95">
          <CardHeader className="pb-6 space-y-1">
            <div className="flex justify-center mb-4">
              <img src={logo || '/placeholder.svg'} alt="UniGuide Logo" className="w-auto h-16" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
            <CardDescription className="text-center">
              Enter your information to get started
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="mb-4">
              <GoogleAuthButton isSignup={true} />
            </div>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstname">First Name</Label>
                  <div className="relative">
                    <UserRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="firstname"
                      placeholder="Firstname"
                      value={formData.firstname}
                      onChange={handleChange}
                      className="pl-10 border-primary/20 focus-visible:ring-primary/30"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname">Last Name</Label>
                  <div className="relative">
                    <UserRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="lastname"
                      placeholder="Lastname"
                      value={formData.lastname}
                      onChange={handleChange}
                      className="pl-10 border-primary/20 focus-visible:ring-primary/30"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 border-primary/20 focus-visible:ring-primary/30"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 border-primary/20 focus-visible:ring-primary/30"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 w-10 h-10"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <span className="sr-only">
                      {showPassword ? 'Hide password' : 'Show password'}
                    </span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 border-primary/20 focus-visible:ring-primary/30"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 w-10 h-10"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                    <span className="sr-only">
                      {showConfirmPassword ? 'Hide password' : 'Show password'}
                    </span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">I am a</Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger className="border-primary/20 focus:ring-primary/30">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="mentor">Mentor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full mt-6 transition-all hover:shadow-lg hover:shadow-primary/25"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center pb-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>

        <div className="absolute w-24 h-24 rounded-full -bottom-4 -right-4 bg-primary/10 blur-xl -z-10" />
        <div className="absolute w-20 h-20 rounded-full -top-4 -left-4 bg-primary/10 blur-xl -z-10" />
      </div>
    </div>
  );
}
