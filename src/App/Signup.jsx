import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Eye, EyeOff, UserRound, Mail, Lock } from "lucide-react"
import logo from "@/assets/UniGuide_logo.png"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import API from "../api"

export default function SignupForm() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  })

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }))
  }

  const handleRoleChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      role: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstname, lastname, email, password, confirmPassword, role } = formData;

    // Ensure passwords match
    if (password.trim() !== confirmPassword.trim()) {
      toast.error("Passwords do not match!");
      return;
    }

    // Check for empty fields
    if (!firstname || !lastname || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields!");
      return;
    }

    setLoading(true);

    try {
      const route = role === "student" ? "/student/signup" : "/mentor/signup";

      const response = await API.post(route, {
        firstname,
        lastname,
        email,
        password,
        confirmPassword,
      });

      if (response.status === 201) {
        toast.success("Registration successful!");
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "student",
        });

        // Navigate to login page after successful signup
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
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
            <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
            <CardDescription className="text-center">Enter your information to get started</CardDescription>
          </CardHeader>

          <CardContent>
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
                    type={showPassword ? "text" : "password"}
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
                {loading ? "Creating Account..." : "Sign Up"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center pb-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>

        <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-primary/10 rounded-full blur-xl -z-10" />
        <div className="absolute -top-4 -left-4 h-20 w-20 bg-primary/10 rounded-full blur-xl -z-10" />
      </div>
    </div>
  )
}
