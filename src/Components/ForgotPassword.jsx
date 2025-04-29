import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Mail } from "lucide-react";
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

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid Gmail address!");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await API.post("/auth/forgot-password", { email });
      
      if (response.status === 200) {
        // Store email in localStorage for the OTP verification
        localStorage.setItem("passwordReset", JSON.stringify({ email }));
        
        toast.success("A verification code has been sent to your email");
        navigate("/verify-otp?action=reset");
      }
    } catch (error) {
      if (error.response?.data?.isGoogleUser) {
        toast.info("You signed up with Google. Please reset your password through Google Account settings.", {
          duration: 6000,
          action: {
            label: "Go to Google",
            onClick: () => window.open("https://myaccount.google.com/signinoptions/password", "_blank")
          }
        });
      } else {
        toast.error(error.response?.data?.message || "Error sending verification code. Please try again.");
      }
      setLoading(false);
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
            <CardTitle className="text-2xl font-bold text-center">Forgot Password</CardTitle>
            <CardDescription className="text-center">
              Enter your email address and we&apos;ll send you a verification code to reset your password
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              
              <Button
                type="submit"
                className="w-full mt-6 transition-all hover:shadow-lg hover:shadow-primary/25"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Code"}
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