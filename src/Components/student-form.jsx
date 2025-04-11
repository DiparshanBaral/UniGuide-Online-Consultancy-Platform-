import PropTypes from "prop-types"; // Import PropTypes
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UserRound, School } from 'lucide-react';
import API from "../api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AvatarUpload } from "@/components/ui/avatarupload";

function StudentProfileForm({ isOpen, onClose, userId }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  const [formData, setFormData] = useState({
    bio: "",
    major: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.bio || !formData.major) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const session = JSON.parse(localStorage.getItem("session"));
      if (!session || !session.token) {
        toast.error("Authentication error. Please log in again.");
        navigate("/login");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("bio", formData.bio);
      formDataToSend.append("major", formData.major);

      if (profilePic) {
        formDataToSend.append("profilePic", profilePic);
      }

      const response = await API.put(`/student/${userId || session._id}`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });

      if (response.status === 200) {
        toast.success("Profile completed successfully!");
        onClose();
        navigate("/");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="bg-primary text-white p-6 rounded-t-lg">
          <DialogTitle className="text-2xl font-bold">Complete Your Student Profile</DialogTitle>
          <p className="text-white/80 mt-2">
            Tell us more about yourself to enhance your UniGuide experience
          </p>
        </DialogHeader>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center mb-6">
              <AvatarUpload
                currentAvatar={null}
                onImageSelect={(file) => setProfilePic(file)}
                onRemove={() => setProfilePic(null)}
                isEditing={true}
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="major" className="text-base">
                  <div className="flex items-center gap-2">
                    <School className="h-4 w-4 text-primary" />
                    Your Major/Field of Study
                  </div>
                </Label>
                <Input
                  id="major"
                  name="major"
                  placeholder="e.g., Computer Science, Business Administration"
                  value={formData.major}
                  onChange={handleInputChange}
                  className="border-primary/20 focus-visible:ring-primary/30"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-base">
                  <div className="flex items-center gap-2">
                    <UserRound className="h-4 w-4 text-primary" />
                    About You
                  </div>
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us about yourself, your academic interests, and your goals..."
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="min-h-[120px] border-primary/20 focus-visible:ring-primary/30"
                  required
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="border-primary/20"
              >
                Complete Later
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Complete Profile"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Add prop validation
StudentProfileForm.propTypes = {
  isOpen: PropTypes.bool.isRequired, // isOpen must be a boolean and is required
  onClose: PropTypes.func.isRequired, // onClose must be a function and is required
  userId: PropTypes.string, // userId must be a string (optional)
};

export default StudentProfileForm;