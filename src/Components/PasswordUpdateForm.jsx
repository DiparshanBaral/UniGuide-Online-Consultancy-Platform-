import { useState } from 'react';
import { toast } from 'sonner';
import API from '../api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EyeIcon, EyeOffIcon, LockIcon } from 'lucide-react';

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

      // Determine the API endpoint based on the user's role
      const endpoint =
        session.role === 'mentor' ? '/mentor/password' : '/student/password';

      // Prepare the request payload
      const payload = {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      };

      // Add the correct ID field based on the role
      if (session.role === 'mentor') {
        payload.mentorId = session._id; // Use mentorId for mentors
      } else {
        payload.studentId = session._id; // Use studentId for students
      }

      const response = await API.put(endpoint, payload, {
        headers: { Authorization: `Bearer ${session.token}` },
      });

      if (response.status === 200) {
        toast.success('Password updated successfully');
        // Reset form
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (error) {
      console.error('Error updating password:', error);

      if (error.response && error.response.status === 400) {
        toast.error('Current password is incorrect');
        setErrors((prev) => ({ ...prev, oldPassword: 'Current password is incorrect' }));
      } else if (error.response && error.response.status === 404) {
        toast.error('User not found');
      } else {
        toast.error('Failed to update password. Please try again.');
      }
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