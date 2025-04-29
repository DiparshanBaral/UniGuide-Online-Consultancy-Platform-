import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import API from "../api";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { KeyRound, RefreshCw } from "lucide-react";
import logo from "@/assets/UniGuide_logo.png";

export default function EnterOTP() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [remainingTime, setRemainingTime] = useState(900); // 15 minutes in seconds
  const [action, setAction] = useState("signup"); // Default action
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get the action (signup, reset, or update) from query parameters
    const queryParams = new URLSearchParams(location.search);
    const actionParam = queryParams.get('action') || 'signup';
    setAction(actionParam);
    
    // Get email from localStorage based on action
    let storedData;
    if (actionParam === 'signup') {
      storedData = JSON.parse(localStorage.getItem("pendingRegistration"));
    } else if (actionParam === 'reset') {
      storedData = JSON.parse(localStorage.getItem("passwordReset"));
    } else if (actionParam === 'update') {
      storedData = JSON.parse(localStorage.getItem("passwordUpdate"));
    }
    
    if (!storedData || !storedData.email) {
      toast.error("No email found. Please start over.");
      // Redirect based on action
      if (actionParam === 'signup') {
        navigate('/signup');
      } else if (actionParam === 'reset') {
        navigate('/forgot-password');
      } else {
        // For password update, return to profile/account page
        navigate('/profile');
      }
      return;
    }
    
    setEmail(storedData.email);
    
    // Set up timer
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [location.search, navigate]);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    
    setLoading(true);
    
    try {
      const verifyResponse = await API.post("/auth/verify-otp", {
        email,
        otp
      });
      
      if (verifyResponse.status === 200) {
        if (action === 'signup') {
          // Complete registration
          const pendingData = JSON.parse(localStorage.getItem("pendingRegistration"));
          const route = pendingData.role === "student" ? "/student/signup" : "/mentor/signup";
          
          const response = await API.post(route, {
            firstname: pendingData.firstname,
            lastname: pendingData.lastname,
            email: pendingData.email,
            password: pendingData.password,
            confirmPassword: pendingData.confirmPassword,
          });
          
          if (response.status === 201) {
            toast.success("Registration successful!");
            localStorage.removeItem("pendingRegistration");
            navigate("/login");
          }
        } else if (action === 'reset') {
          // Navigate to reset password page
          toast.success("Email verified! You can now reset your password.");
          navigate("/reset-password");
        } else if (action === 'update') {
          // Complete password update
          const updateData = JSON.parse(localStorage.getItem("passwordUpdate"));
          
          if (!updateData || !updateData.email || !updateData.newPassword) {
            toast.error("Missing update information. Please try again.");
            navigate("/account");
            return;
          }
          
          const session = JSON.parse(localStorage.getItem("session"));
          
          const response = await API.post("/auth/update-password", {
            email: updateData.email,
            newPassword: updateData.newPassword,
            role: session.role
          }, {
            headers: { Authorization: `Bearer ${session.token}` }
          });
          
          if (response.status === 200) {
            toast.success("Password updated successfully!");
            localStorage.removeItem("passwordUpdate");
            navigate("/profile");
          }
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleResendOTP = async () => {
    try {
      setLoading(true);
      const response = await API.post("/auth/resend-otp", { email });
      
      if (response.status === 200) {
        toast.success("A new OTP has been sent to your email");
        setRemainingTime(900); // Reset timer to 15 minutes
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background">
      <div className="w-full max-w-md relative z-10">
        <div className="absolute inset-0 bg-white/30 rounded-2xl blur-xl -z-10 transform -rotate-3" />
        <div className="absolute inset-0 bg-white/30 rounded-2xl blur-xl -z-10 transform rotate-3" />
        
        <Card className="w-full border border-primary/20 shadow-xl bg-card/95">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex justify-center mb-4">
              <img src={logo || "/placeholder.svg"} alt="UniGuide Logo" className="h-16 w-auto" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Verify Your Email</CardTitle>
            <CardDescription className="text-center">
              We&apos;ve sent a 6-digit verification code to<br />
              <span className="font-medium">{email}</span>
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter Verification Code</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="otp"
                    placeholder="6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').substring(0, 6))}
                    className="pl-10 border-primary/20 focus-visible:ring-primary/30 text-center tracking-widest text-lg"
                    required
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                  />
                </div>
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                Code expires in <span className="font-medium">{formatTime(remainingTime)}</span>
              </div>
              
              <Button
                type="submit"
                className="w-full mt-6 transition-all hover:shadow-lg hover:shadow-primary/25"
                disabled={loading || remainingTime === 0}
              >
                {loading ? "Verifying..." : "Verify Email"}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col items-center pb-6 gap-2">
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the code?
            </p>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleResendOTP}
              disabled={loading || remainingTime > 870} // Allow resend after 30 seconds
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              Resend Code {remainingTime > 870 && `(${formatTime(remainingTime - 870)})`}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}