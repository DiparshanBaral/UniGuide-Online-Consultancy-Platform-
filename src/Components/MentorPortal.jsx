import { useState, useEffect } from "react";
import { toast } from "sonner";
import API from "../api";
import { useParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function MentorPortal() {
  const { id } = useParams(); // Student ID
  const [portal, setPortal] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "" });
  const [isAddingTask, setIsAddingTask] = useState(false);

  useEffect(() => {
    const fetchPortalData = async () => {
      try {
        const session = JSON.parse(localStorage.getItem("session"));
        if (!session || !session.token) {
          toast.error("You must be logged in to view the portal.");
          return;
        }

        const response = await API.get(`/portal/mentor/${id}`, {
          headers: { Authorization: `Bearer ${session.token}` },
        });

        if (response.status === 200) {
          const portalData = response.data;
          setPortal(portalData);
          setTasks(portalData.tasks || []);
          setDocuments(portalData.documents || []);
        } else {
          toast.error("Failed to fetch portal data.");
        }
      } catch (error) {
        console.error("Error fetching portal data:", error);
        toast.error("An error occurred while fetching the portal data.");
      }
    };

    fetchPortalData();
  }, [id]);

  const handleAddTask = async () => {
    try {
      const session = JSON.parse(localStorage.getItem("session"));
      const response = await API.post(
        `/portal/${portal._id}/tasks`,
        newTask,
        {
          headers: { Authorization: `Bearer ${session.token}` },
        }
      );

      if (response.status === 200) {
        setTasks([...tasks, response.data]);
        setNewTask({ title: "", description: "", dueDate: "" });
        setIsAddingTask(false);
        toast.success("Task added successfully!");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("An error occurred while adding the task.");
    }
  };

  if (!portal) {
    return <div>No portal data found.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Mentor Portal</h1>

      {/* Portal Header */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Application Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">
            <strong>Status:</strong> {portal.applicationStatus}
          </p>
          <p className="text-lg">
            <strong>Country:</strong> {portal.country}
          </p>
        </CardContent>
      </Card>

      {/* Tasks Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {tasks.length > 0 ? (
            <ul className="space-y-4">
              {tasks.map((task) => (
                <li key={task.taskId} className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{task.title}</h3>
                    <p>{task.description}</p>
                    <p className="text-sm text-gray-500">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      task.status === "Completed"
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {task.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tasks available.</p>
          )}

          {/* Add Task Form */}
          {isAddingTask && (
            <div className="mt-6 space-y-4">
              <input
                type="text"
                placeholder="Task Title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <textarea
                placeholder="Task Description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <div className="flex gap-4">
                <Button onClick={handleAddTask}>Add Task</Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAddingTask(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          {!isAddingTask && (
            <Button onClick={() => setIsAddingTask(true)} className="mt-4">
              Add New Task
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Documents Section */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length > 0 ? (
            <ul className="space-y-4">
              {documents.map((doc) => (
                <li key={doc._id} className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{doc.title}</h3>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View Document
                    </a>
                  </div>
                  <p className="text-sm text-gray-500">
                    Uploaded by: {doc.uploadedBy}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No documents uploaded yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default MentorPortal;