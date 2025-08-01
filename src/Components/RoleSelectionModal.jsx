import { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@/Components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Label } from "@/Components/ui/label";
import { GraduationCap, Briefcase } from 'lucide-react';

export default function RoleSelectionModal({ isOpen, onClose, onRoleSelect, isSignup = false }) {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleContinue = () => {
    if (!selectedRole) return;
    onRoleSelect(selectedRole);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">Choose Your Role</DialogTitle>
          <DialogDescription className="text-center">
            {isSignup 
              ? "Select your role to continue with Google signup" 
              : "Select your account type to continue with Google login"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <RadioGroup value={selectedRole} onValueChange={setSelectedRole} className="grid grid-cols-2 gap-4">
            <div className={`relative flex flex-col items-center justify-between rounded-lg border-2 p-4 ${selectedRole === "student" ? "border-primary bg-primary/5" : "border-muted"}`}>
              <RadioGroupItem value="student" id="student" className="sr-only" />
              <Label htmlFor="student" className="flex flex-col items-center gap-2 cursor-pointer">
                <GraduationCap className="h-8 w-8 text-primary" />
                <span className="font-medium">Student</span>
                <span className="text-xs text-muted-foreground text-center">Looking for guidance and mentorship</span>
              </Label>
            </div>
            
            <div className={`relative flex flex-col items-center justify-between rounded-lg border-2 p-4 ${selectedRole === "mentor" ? "border-primary bg-primary/5" : "border-muted"}`}>
              <RadioGroupItem value="mentor" id="mentor" className="sr-only" />
              <Label htmlFor="mentor" className="flex flex-col items-center gap-2 cursor-pointer">
                <Briefcase className="h-8 w-8 text-primary" />
                <span className="font-medium">Mentor</span>
                <span className="text-xs text-muted-foreground text-center">Offering expertise and guidance</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleContinue} disabled={!selectedRole}>
            {isSignup ? "Sign Up" : "Log In"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

RoleSelectionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onRoleSelect: PropTypes.func.isRequired,
  isSignup: PropTypes.bool,
};