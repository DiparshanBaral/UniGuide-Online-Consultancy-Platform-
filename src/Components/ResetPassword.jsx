import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, Lock } from "lucide-react";
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
import logo from "@/assets/UniGuide_logo.PNG";

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Get email from localStorage
    const resetData = JSON.parse(localStorage.getItem("passwordReset"));
    
    if (!resetData || !resetData.email) {
      toast.error("No email found. Please start the password reset process again.");
      navigate("/forgot-password");
      return;
    }
    
    setEmail(resetData.email);
  }, [navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { newPassword, confirmPassword } = formData;
    
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await API.post("/auth/reset-password", {
        email,
        newPassword
      });
      
      if (response.status === 200) {
        toast.success("Password has been reset successfully!");
        localStorage.removeItem("passwordReset");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password. Please try again.");
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
            <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">
              Create a new password for your account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.newPassword}
                    onChange={handleChange}
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
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
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
                    className="absolute right-0 top-0 h-10 w-10"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full mt-6 transition-all hover:shadow-lg hover:shadow-primary/25"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-center pb-6">
            <Button 
              variant="link" 
              className="text-sm text-muted-foreground"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}