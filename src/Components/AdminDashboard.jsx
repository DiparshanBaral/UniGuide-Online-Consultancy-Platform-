import { useState } from "react";
import { toast } from "sonner";
import API from "../api";
import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export default function AdminDashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    country: "",
    name: "",
    location: "",
    ranking: "",
    coursesOffered: [],
    contact: {
      phone: "",
      email: "",
    },
    website: "",
    description: "",
    tuitionFee: { undergraduate: "", graduate: "" },
    acceptanceRate: "",
    graduationRate: "",
  });

  const openModal = () => {
    setForm({
      country: "",
      name: "",
      location: "",
      ranking: "",
      coursesOffered: [],
      contact: { phone: "", email: "" },
      website: "",
      description: "",
      tuitionFee: { undergraduate: "", graduate: "" },
      acceptanceRate: "",
      graduationRate: "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/universities/add", form);  // Post to /universities/add
      toast.success("University added successfully!");
      closeModal();  // Close modal after success
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="pt-[90px] min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <Button onClick={openModal} className="bg-gray-900 hover:bg-gray-700 text-white">
            + Add University
          </Button>
        </div>
      </div>

      {/* Add University Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg mx-auto p-6 rounded-lg bg-white shadow-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New University</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Country Select */}
            <Select value={form.country} onValueChange={(value) => setForm({ ...form, country: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="UK">United Kingdom</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
                <SelectItem value="Australia">Australia</SelectItem>
              </SelectContent>
            </Select>

            {/* Other Fields */}
            <Input
              type="text"
              placeholder="University Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              type="text"
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
            />
            <Input
              type="number"
              placeholder="Global Ranking"
              value={form.ranking}
              onChange={(e) => setForm({ ...form, ranking: e.target.value })}
              required
            />
            <Input
              type="text"
              placeholder="Courses Offered (comma separated)"
              value={form.coursesOffered.join(", ")}
              onChange={(e) => setForm({ ...form, coursesOffered: e.target.value.split(",").map((course) => course.trim()) })}
              required
            />
            <Input
              type="text"
              placeholder="Phone Number"
              value={form.contact.phone}
              onChange={(e) => setForm({ ...form, contact: { ...form.contact, phone: e.target.value } })}
            />
            <Input
              type="email"
              placeholder="Email"
              value={form.contact.email}
              onChange={(e) => setForm({ ...form, contact: { ...form.contact, email: e.target.value } })}
            />
            <Input
              type="url"
              placeholder="Website"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
            />
            <Input
              type="text"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Undergraduate Tuition Fee ($)"
              value={form.tuitionFee.undergraduate}
              onChange={(e) => setForm({ ...form, tuitionFee: { ...form.tuitionFee, undergraduate: e.target.value } })}
              required
            />
            <Input
              type="number"
              placeholder="Graduate Tuition Fee ($)"
              value={form.tuitionFee.graduate}
              onChange={(e) => setForm({ ...form, tuitionFee: { ...form.tuitionFee, graduate: e.target.value } })}
              required
            />
            <Input
              type="number"
              placeholder="Acceptance Rate (%)"
              value={form.acceptanceRate}
              onChange={(e) => setForm({ ...form, acceptanceRate: e.target.value })}
              required
            />
            <Input
              type="number"
              placeholder="Graduation Rate (%)"
              value={form.graduationRate}
              onChange={(e) => setForm({ ...form, graduationRate: e.target.value })}
              required
            />
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Add University
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
