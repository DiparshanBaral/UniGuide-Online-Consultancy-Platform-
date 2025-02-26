import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Toaster, toast } from 'sonner';
import { motion } from 'framer-motion';
import { Trash2, Edit, PlusCircle, CheckCircle, AlertCircle, FileText, MessageCircle } from 'lucide-react';
import API from '../api';

const MentorPortal = () => {
  const { portalid } = useParams();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });
  const [editingTask, setEditingTask] = useState(null);
  const [activeTab, setActiveTab] = useState('tasks'); // Tracks the active tab

  // Memoize fetchTasks to prevent recreation on every render
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

  // Add a new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      // Ensure all fields are filled
      if (!newTask.title || !newTask.description || !newTask.dueDate) {
        toast.error('All fields are required.', {
          description: 'Please fill in the title, description, and due date.',
        });
        return;
      }

      // Send the request with portalId in the URL path
      await API.post(`/portal/${portalid}/tasks`, {
        title: newTask.title,
        description: newTask.description,
        dueDate: newTask.dueDate,
      });

      // Refetch tasks and reset the form
      fetchTasks();
      setNewTask({ title: '', description: '', dueDate: '' });

      // Show success notification
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

  // Update an existing task
  const handleUpdateTask = async (taskId) => {
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

  // Delete a task
  const handleDeleteTask = async (taskId) => {
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 p-8 flex"
    >
      {/* Toaster for notifications */}
      <Toaster position="top-center" richColors />

      {/* Left Navigation Bar */}
      <aside className="w-64 bg-white shadow-lg rounded-lg p-4 mr-8">
        <nav className="space-y-4">
          <Button
            variant={activeTab === 'tasks' ? 'default' : 'outline'}
            className="w-full justify-start"
            onClick={() => setActiveTab('tasks')}
          >
            <CheckCircle className="mr-2 h-5 w-5" /> Tasks
          </Button>
          <Button
            variant={activeTab === 'documents' ? 'default' : 'outline'}
            className="w-full justify-start"
            onClick={() => setActiveTab('documents')}
          >
            <FileText className="mr-2 h-5 w-5" /> Documents
          </Button>
          <Button
            variant={activeTab === 'chat' ? 'default' : 'outline'}
            className="w-full justify-start"
            onClick={() => setActiveTab('chat')}
          >
            <MessageCircle className="mr-2 h-5 w-5" /> Chat
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Render content based on the active tab */}
        {activeTab === 'tasks' && (
          <>
            {/* Add Task Form */}
            <Card className="mt-[50px] max-w-4xl mx-auto shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlusCircle className="h-6 w-6 text-primary" />
                  Add New Task
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddTask} className="space-y-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        type="text"
                        placeholder="Enter task title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input
                        type="text"
                        placeholder="Enter task description"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>Due Date</Label>
                      <Input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full md:w-auto">
                    Add Task
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Task List */}
            <Separator className="my-6" />
            <Card className="max-w-4xl mx-auto shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-6 w-6 text-primary" />
                  Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mt-4 space-y-4">
                  {tasks.length > 0 ? (
                    tasks.map((task) => (
                      <motion.div
                        key={task._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white p-4 rounded-lg shadow-sm"
                      >
                        <div className="flex justify-between items-center">
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
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => setEditingTask(task)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => handleDeleteTask(task._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-gray-500">No tasks available.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Documents Section */}
        {activeTab === 'documents' && (
          <Card className="mt-[50px] max-w-4xl mx-auto shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                Documents
              </CardTitle>
              <CardDescription>View and manage documents shared by students.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">This feature is coming soon.</p>
            </CardContent>
          </Card>
        )}

        {/* Chat Section */}
        {activeTab === 'chat' && (
          <Card className="mt-[50px] max-w-4xl mx-auto shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-6 w-6 text-primary" />
                Chat
              </CardTitle>
              <CardDescription>Communicate with your student through chat.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">This feature is coming soon.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                    onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
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
                  <Button
                    variant="outline"
                    onClick={() => setEditingTask(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </motion.div>
  );
};

export default MentorPortal;