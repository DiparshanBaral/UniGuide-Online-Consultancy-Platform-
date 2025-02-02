import { useState, useEffect } from "react";
import { toast } from "sonner";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, Pencil } from "lucide-react";

export default function AdminDashboard() {
  const [universities, setUniversities] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState(null);
  const [form, setForm] = useState({ name: "", image: "", ranking: "", acceptanceRate: "", graduationRate: "", tuition: "", financialAid: "" });

  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const response = await API.get("/universities");
      setUniversities(response.data);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Failed to fetch universities.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUniversity) {
        await API.put(`/universities/${editingUniversity._id}`, form);
        toast.success("University updated successfully!");
      } else {
        await API.post("/universities", form);
        toast.success("University added successfully!");
      }
      fetchUniversities();
      closeModal();
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this university?")) {
      try {
        await API.delete(`/universities/${id}`);
        toast.success("University deleted successfully!");
        fetchUniversities();
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        toast.error("Failed to delete university.");
      }
    }
  };

  const openModal = (university = null) => {
    setEditingUniversity(university);
    setForm(university || { name: "", image: "", ranking: "", acceptanceRate: "", graduationRate: "", tuition: "", financialAid: "" });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingUniversity(null);
  };

  return (
    <div className="pt-[90px] min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <Button onClick={() => openModal()} className="bg-gray-900 hover:bg-gray-700 text-white">+ Add University</Button>
        </div>

        {/* University List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {universities.map((uni) => (
            <Card key={uni._id} className="shadow-lg hover:shadow-xl transition rounded-2xl">
              <CardContent className="p-5">
                <img src={uni.image} alt={uni.name} className="h-40 w-full object-cover rounded-md mb-4" />
                <h3 className="text-lg font-semibold">{uni.name}</h3>
                <p className="text-sm text-gray-500">Global Ranking: <span className="font-semibold">{uni.ranking}</span></p>
                <p className="text-sm text-gray-500">Acceptance Rate: <span className="font-semibold">{uni.acceptanceRate}%</span></p>
                <p className="text-sm text-gray-500">Graduation Rate: <span className="font-semibold">{uni.graduationRate}%</span></p>
                <p className="text-sm text-gray-500">Tuition: <span className="font-semibold">${uni.tuition}</span></p>
                <p className="text-sm text-gray-500">Avg. Financial Aid: <span className="font-semibold">${uni.financialAid}</span></p>
                <div className="flex gap-2 mt-4">
                  <Button onClick={() => openModal(uni)} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1">
                    <Pencil size={16} /> Edit
                  </Button>
                  <Button onClick={() => handleDelete(uni._id)} className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-1">
                    <Trash2 size={16} /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg mx-auto p-6 rounded-lg bg-white shadow-lg">
          <DialogHeader>
            <DialogTitle>{editingUniversity ? "Edit University" : "Add New University"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input type="text" placeholder="University Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input type="text" placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required />
            <Input type="number" placeholder="Global Ranking" value={form.ranking} onChange={(e) => setForm({ ...form, ranking: e.target.value })} required />
            <Input type="number" placeholder="Acceptance Rate (%)" value={form.acceptanceRate} onChange={(e) => setForm({ ...form, acceptanceRate: e.target.value })} required />
            <Input type="number" placeholder="Graduation Rate (%)" value={form.graduationRate} onChange={(e) => setForm({ ...form, graduationRate: e.target.value })} required />
            <Input type="number" placeholder="Tuition Fee ($)" value={form.tuition} onChange={(e) => setForm({ ...form, tuition: e.target.value })} required />
            <Input type="number" placeholder="Avg. Financial Aid ($)" value={form.financialAid} onChange={(e) => setForm({ ...form, financialAid: e.target.value })} required />
            <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-700 text-white py-2 rounded-lg">
              {editingUniversity ? "Update University" : "Add University"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}