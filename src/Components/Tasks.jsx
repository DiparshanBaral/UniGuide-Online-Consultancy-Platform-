import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Toaster, toast } from 'sonner';
import { motion } from 'framer-motion';
import { Trash2, Edit, PlusCircle, CheckCircle, Undo2 } from 'lucide-react';
import API from '../api';

const Tasks = () => {
  const { portalid } = useParams();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });
  const [editingTask, setEditingTask] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch session data from localStorage on initial render
  useEffect(() => {
    const savedSession = localStorage.getItem('session');
    if (savedSession) {
      setSession(JSON.parse(savedSession)); // Set session from localStorage if it exists
    }
    setIsLoading(false);
  }, []);

  // Fetch tasks
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

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Add a new task (Mentor only)
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (session.role !== 'mentor') return;

    try {
      if (!newTask.title || !newTask.description || !newTask.dueDate) {
        toast.error('All fields are required.', {
          description: 'Please fill in the title, description, and due date.',
        });
        return;
      }

      await API.post(`/portal/${portalid}/tasks`, {
        title: newTask.title,
        description: newTask.description,
        dueDate: newTask.dueDate,
      });

      fetchTasks();
      setNewTask({ title: '', description: '', dueDate: '' });
      toast.success('Task added successfully!', {
        description: 'The task has been created.',
      });
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task. Please try again.', {
        description: 'An unexpected error occurred.',
      });
    }
  };

  // Update a task's details (Mentor only)
  const handleUpdateTask = async (taskId) => {
    if (session.role !== 'mentor') return;

    try {
      await API.put('/portal/updatetask', {
        portalId: portalid,
        taskId,
        ...editingTask,
      });

      fetchTasks();
      setEditingTask(null);
      toast.success('Task updated successfully!', {
        description: 'The task has been updated.',
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task. Please try again.', {
        description: 'An unexpected error occurred.',
      });
    }
  };

  // Update a task's status (Student only)
  const handleUpdateTaskStatus = async (taskId, taskStatus) => {
    if (session.role !== 'student') return;

    try {
      await API.put('/portal/task/status', {
        portalId: portalid,
        taskId,
        taskStatus,
      });

      fetchTasks();
      toast.success('Task status updated successfully!', {
        description: 'The task status has been updated.',
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status. Please try again.', {
        description: 'An unexpected error occurred.',
      });
    }
  };

  // Delete a task (Mentor only)
  const handleDeleteTask = async (taskId) => {
    if (session.role !== 'mentor') return;

    try {
      await API.delete('/portal/task/delete', {
        data: { portalId: portalid, taskId },
      });

      fetchTasks();
      toast.success('Task deleted successfully!', {
        description: 'The task has been removed.',
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task. Please try again.', {
        description: 'An unexpected error occurred.',
      });
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {/* Toaster for notifications */}
      <Toaster position="top-center" richColors />

      {/* Main Content */}
      <CardContent>
        {/* Add Task Form (Mentor Only) */}
        {session.role === 'mentor' && (
          <Card className="max-w-7xl mx-auto shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                <PlusCircle className="h-8 w-8 text-primary" />
                Add New Task
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddTask} className="space-y-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label className="text-sm font-medium">Title</Label>
                    <Input
                      type="text"
                      placeholder="Enter task title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <Input
                      type="text"
                      placeholder="Enter task description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Due Date</Label>
                    <Input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full md:w-auto px-6 py-2 bg-black hover:bg-gray-900 text-white font-semibold rounded-md shadow-md"
                >
                  Add Task
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Task List */}
        <Card className="max-w-7xl mx-auto shadow-lg">
          <CardContent>
            <h3 className="pt-[20px] text-2xl font-semibold flex items-center gap-3 mb-6">
              <CheckCircle className="h-7 w-7 text-dark-500" />
              Task List
            </h3>
            <div className="space-y-6">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <motion.div
                    key={task._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center"
                  >
                    <div>
                      <h4 className="text-lg font-semibold">{task.title}</h4>
                      <p className="text-base text-gray-600">{task.description}</p>
                      <p className="text-sm text-gray-500">
                        {task.dueDate
                          ? `Due Date: ${new Date(task.dueDate).toLocaleDateString()}`
                          : 'No due date'}
                      </p>
                      <Badge
                        variant={task.taskStatus === 'Completed' ? 'success' : 'secondary'}
                        className="mt-3 px-3 py-1 text-sm font-medium"
                      >
                        {task.taskStatus}
                      </Badge>
                    </div>
                    <div className="flex gap-3">
                      {session.role === 'mentor' && (
                        <>
                          <Button
                            size="icon"
                            variant="outline"
                            className="border-gray-300 hover:bg-gray-100 shadow-sm"
                            onClick={() => setEditingTask(task)}
                          >
                            <Edit className="h-6 w-6" />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="hover:bg-red-600 shadow-md"
                            onClick={() => handleDeleteTask(task._id)}
                          >
                            <Trash2 className="h-6 w-6" />
                          </Button>
                        </>
                      )}
                      {session.role === 'student' && task.taskStatus === 'Pending' && (
                        <Button
                          size="icon"
                          variant="default"
                          className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-700 text-white shadow-md"
                          onClick={() => handleUpdateTaskStatus(task._id, 'Completed')}
                        >
                          <CheckCircle className="h-6 w-6 text-white" />
                        </Button>
                      )}
                      {session.role === 'student' && task.taskStatus === 'Completed' && (
                        <Button
                          size="icon"
                          variant="outline"
                          className="border-gray-300 text-gray-700 hover:bg-gray-100 shadow-sm"
                          onClick={() => handleUpdateTaskStatus(task._id, 'Pending')}
                        >
                          <Undo2 className="h-6 w-6" />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-lg text-gray-500">No tasks available.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </CardContent>

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Edit Task</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={() => handleUpdateTask(editingTask._id)} className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    type="text"
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    type="text"
                    value={editingTask.description}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, description: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={editingTask.dueDate}
                    onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditingTask(null)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default Tasks;
