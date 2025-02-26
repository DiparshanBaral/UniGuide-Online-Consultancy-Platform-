import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Toaster, toast } from 'sonner';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';
import API from '../api';

const StudentPortal = () => {
  const { portalid } = useParams();
  const [tasks, setTasks] = useState([]);

  // Fetch all tasks for the portal
  const fetchTasks = useCallback(async () => {
    try {
      const response = await API.get(`/portal/tasks?portalId=${portalid}`);
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks. Please try again.', {
        description: 'An unexpected error occurred.',
      });
    }
  }, [portalid]);

  // Fetch tasks when the component mounts or when portalid changes
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Update task status (Completed/Pending)
  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await API.put('/portal/task/status', {
        portalId: portalid,
        taskId,
        taskStatus: newStatus,
      });
      fetchTasks(); // Refetch tasks to reflect the updated status
      toast.success(`Task marked as ${newStatus.toLowerCase()} successfully!`);
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status. Please try again.', {
        description: 'An unexpected error occurred.',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 p-8"
    >
      {/* Toaster for notifications */}
      <Toaster position="top-center" richColors />
      {/* Main Card */}
      <Card className="mt-[50px] max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-primary" />
            Student Portal
          </CardTitle>
          <CardDescription>View and manage your tasks for this mentorship.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Task List */}
          <Separator className="my-6" />
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            Tasks
          </h3>
          <div className="mt-4 space-y-4">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-gray-500">{task.description}</p>
                    <Badge
                      variant={task.taskStatus === 'Completed' ? 'success' : 'secondary'}
                      className="mt-2"
                    >
                      {task.taskStatus}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    {task.taskStatus === 'Pending' && (
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleUpdateTaskStatus(task._id, 'Completed')}
                      >
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </Button>
                    )}
                    {task.taskStatus === 'Completed' && (
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleUpdateTaskStatus(task._id, 'Pending')}
                      >
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500">No tasks available.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StudentPortal;