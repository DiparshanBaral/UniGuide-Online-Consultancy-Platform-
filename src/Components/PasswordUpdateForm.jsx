import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import API from '../api';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { EyeIcon, EyeOffIcon, LockIcon, ExternalLinkIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";

export default function PasswordUpdateForm() {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [checkingAuthType, setCheckingAuthType] = useState(true);

  useEffect(() => {
    // Check if user is a Google-authenticated user
    const checkAuthType = async () => {
      try {
        const session = JSON.parse(localStorage.getItem('session'));
        if (!session || !session.token || !session._id || !session.email) {
          toast.error('Session information is incomplete');
          return;
        }

        // Call API to check if user has password (i.e., not a Google-only user)
        const response = await API.get(`/auth/check-auth-type`, {
          params: { email: session.email },
          headers: { Authorization: `Bearer ${session.token}` }
        });

        setIsGoogleUser(response.data.isGoogleUser);
      } catch (error) {
        console.error('Error checking authentication type:', error);
        toast.error('Unable to determine account type');
      } finally {
        setCheckingAuthType(false);
      }
    };

    checkAuthType();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.oldPassword) {
      newErrors.oldPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const session = JSON.parse(localStorage.getItem('session'));
      if (!session || !session.token || !session._id || !session.role) {
        toast.error('You must be logged in to update your password');
        return;
      }

      // First verify the current password
      const verifyResponse = await API.post("/auth/verify-password", {
        email: session.email,
        password: formData.oldPassword,
        role: session.role
      });
      
      if (verifyResponse.status === 200) {
        // Store email and new password in localStorage
        localStorage.setItem("passwordUpdate", JSON.stringify({
          email: session.email,
          newPassword: formData.newPassword
        }));
        
        // Send OTP for verification
        const otpResponse = await API.post("/auth/verify-email", { 
          email: session.email 
        });
        
        if (otpResponse.status === 200) {
          // Navigate to OTP verification
          window.location.href = "/verify-otp?action=update";
        }
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error(error.response?.data?.message || 'Incorrect current password');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    switch (field) {
      case 'old':
        setShowOldPassword(!showOldPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  if (checkingAuthType) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isGoogleUser) {
    return (
      <div className="space-y-6">
        <Alert className="bg-blue-50 border-blue-200">
          <LockIcon className="h-4 w-4" />
          <AlertTitle>Google Account Detected</AlertTitle>
          <AlertDescription>
            You signed up using Google authentication. To change your password, you&apos;ll need to update it through your Google Account settings.
          </AlertDescription>
        </Alert>
        
        <div className="flex flex-col items-center space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Your password is managed by Google. Please visit your Google Account settings to make any changes.
          </p>
          
          <Button
            onClick={() => window.open("https://myaccount.google.com/signinoptions/password", "_blank")}
            className="flex items-center gap-2"
          >
            Go to Google Password Settings
            <ExternalLinkIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="oldPassword" className="flex items-center gap-2">
          <LockIcon className="h-4 w-4 text-primary" />
          Current Password
        </Label>
        <div className="relative">
          <Input
            id="oldPassword"
            name="oldPassword"
            type={showOldPassword ? 'text' : 'password'}
            value={formData.oldPassword}
            onChange={handleChange}
            className={errors.oldPassword ? 'border-red-500' : ''}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={() => togglePasswordVisibility('old')}
          >
            {showOldPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            <span className="sr-only">Toggle password visibility</span>
          </Button>
        </div>
        {errors.oldPassword && <p className="text-sm text-red-500">{errors.oldPassword}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword" className="flex items-center gap-2">
          <LockIcon className="h-4 w-4 text-primary" />
          New Password
        </Label>
        <div className="relative">
          <Input
            id="newPassword"
            name="newPassword"
            type={showNewPassword ? 'text' : 'password'}
            value={formData.newPassword}
            onChange={handleChange}
            className={errors.newPassword ? 'border-red-500' : ''}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={() => togglePasswordVisibility('new')}
          >
            {showNewPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            <span className="sr-only">Toggle password visibility</span>
          </Button>
        </div>
        {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="flex items-center gap-2">
          <LockIcon className="h-4 w-4 text-primary" />
          Confirm New Password
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? 'border-red-500' : ''}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={() => togglePasswordVisibility('confirm')}
          >
            {showConfirmPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            <span className="sr-only">Toggle password visibility</span>
          </Button>
        </div>
        {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="animate-spin mr-2">⚬</span>
              Updating...
            </>
          ) : (
            'Update Password'
          )}
        </Button>
      </div>
    </form>
  );
}