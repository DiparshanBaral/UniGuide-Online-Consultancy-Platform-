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

function StudentPortal() {
  const { id } = useParams(); // Mentor ID
  const [portal, setPortal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchPortalData = async () => {
      setIsLoading(true);
      try {
        const session = JSON.parse(localStorage.getItem("session"));
        if (!session || !session.token) {
          toast.error("You must be logged in to view the portal.");
          return;
        }

        const response = await API.get(`/portals/student/${id}`, {
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortalData();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!portal) {
    return <div>No portal data found.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Student Portal</h1>

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

export default StudentPortal;