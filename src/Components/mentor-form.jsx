import PropTypes from "prop-types"; // Import PropTypes
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UserRound, BookOpen, Briefcase, Globe } from 'lucide-react';
import API from "../api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AvatarUpload } from "@/components/ui/avatarupload";
import { Badge } from "@/components/ui/badge";
import { X } from 'lucide-react';

function MentorProfileForm({ isOpen, onClose, userId }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [formData, setFormData] = useState({
    bio: "",
    expertise: [],
    degree: "",
    yearsOfExperience: 0,
    languages: [],
    currentExpertise: "",
    currentLanguage: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addExpertise = () => {
    if (formData.currentExpertise.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        expertise: [...prev.expertise, prev.currentExpertise.trim()],
        currentExpertise: ""
      }));
    }
  };

  const removeExpertise = (index) => {
    setFormData((prev) => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index)
    }));
  };

  const addLanguage = () => {
    if (formData.currentLanguage.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, prev.currentLanguage.trim()],
        currentLanguage: ""
      }));
    }
  };

  const removeLanguage = (index) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.bio || !formData.degree || formData.expertise.length === 0) {
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
      formDataToSend.append("expertise", JSON.stringify(formData.expertise));
      formDataToSend.append("degree", formData.degree);
      formDataToSend.append("yearsOfExperience", formData.yearsOfExperience);
      formDataToSend.append("languages", JSON.stringify(formData.languages));
      if (profilePic) {
        formDataToSend.append("profilePic", profilePic);
      }
      const response = await API.put(`/mentor/${userId || session._id}`, formDataToSend, {
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
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-primary text-white p-6 rounded-t-lg sticky top-0 z-10">
          <DialogTitle className="text-2xl font-bold">Complete Your Mentor Profile</DialogTitle>
          <p className="text-white/80 mt-2">
            Share your expertise and experience to help students achieve their academic goals
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
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-base">
                  <div className="flex items-center gap-2">
                    <UserRound className="h-4 w-4 text-primary" />
                    Professional Bio
                  </div>
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Share your academic background, professional experience, and how you can help students..."
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="min-h-[120px] border-primary/20 focus-visible:ring-primary/30"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="degree" className="text-base">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Degree
                  </div>
                </Label>
                <Input
                  id="degree"
                  name="degree"
                  placeholder="e.g., Master of Computer Science"
                  value={formData.degree}
                  onChange={handleInputChange}
                  className="border-primary/20 focus-visible:ring-primary/30"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearsOfExperience" className="text-base">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    Years of Experience
                  </div>
                </Label>
                <Input
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  type="number"
                  min="0"
                  placeholder="e.g., 5"
                  value={formData.yearsOfExperience}
                  onChange={handleInputChange}
                  className="border-primary/20 focus-visible:ring-primary/30"
                  required
                />
              </div>
              <div className="space-y-3">
                <Label className="text-base">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Areas of Expertise
                  </div>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="currentExpertise"
                    name="currentExpertise"
                    placeholder="e.g., Scholarship Applications"
                    value={formData.currentExpertise}
                    onChange={handleInputChange}
                    className="border-primary/20 focus-visible:ring-primary/30"
                  />
                  <Button type="button" onClick={addExpertise} className="shrink-0">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.expertise.map((item, index) => (
                    <Badge key={index} variant="secondary" className="pl-3 pr-2 py-1.5 bg-primary/10 text-primary">
                      {item}
                      <button
                        type="button"
                        onClick={() => removeExpertise(index)}
                        className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {formData.expertise.length === 0 && (
                    <p className="text-sm text-muted-foreground">No expertise areas added yet</p>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-base">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    Languages
                  </div>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="currentLanguage"
                    name="currentLanguage"
                    placeholder="e.g., English"
                    value={formData.currentLanguage}
                    onChange={handleInputChange}
                    className="border-primary/20 focus-visible:ring-primary/30"
                  />
                  <Button type="button" onClick={addLanguage} className="shrink-0">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.languages.map((item, index) => (
                    <Badge key={index} variant="outline" className="pl-3 pr-2 py-1.5">
                      {item}
                      <button
                        type="button"
                        onClick={() => removeLanguage(index)}
                        className="ml-1 hover:bg-muted rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {formData.languages.length === 0 && (
                    <p className="text-sm text-muted-foreground">No languages added yet</p>
                  )}
                </div>
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
MentorProfileForm.propTypes = {
  isOpen: PropTypes.bool.isRequired, // isOpen must be a boolean and is required
  onClose: PropTypes.func.isRequired, // onClose must be a function and is required
  userId: PropTypes.string, // userId must be a string (optional)
};

export default MentorProfileForm;