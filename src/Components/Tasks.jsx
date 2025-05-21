"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import PropTypes from "prop-types" // Add this import
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Badge } from "@/Components/ui/badge"
import { Toaster, toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, Edit, PlusCircle, CheckCircle, Undo2, Calendar, Clock, Loader2, ClipboardList } from "lucide-react"
import API from "../api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/Components/ui/dialog"

const Tasks = ({ sessionRole }) => {
  const { portalid } = useParams()
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "" })
  const [editingTask, setEditingTask] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)

  // Instead, just initialize loading state when component loads
  useEffect(() => {
    setIsLoading(true)
  }, [])

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await API.get(`/portal/tasks?portalId=${portalid}`)
      setTasks(response.data.tasks)
    } catch (error) {
      console.error("Error fetching tasks:", error)
      toast.error("Failed to fetch tasks. Please try again.", {
        description: "An unexpected error occurred.",
      })
    } finally {
      setIsLoading(false)
    }
  }, [portalid])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  // Add a new task (Mentor only)
  const handleAddTask = async (e) => {
    e.preventDefault()
    if (sessionRole !== "mentor") return

    try {
      if (!newTask.title || !newTask.description || !newTask.dueDate) {
        toast.error("All fields are required.", {
          description: "Please fill in the title, description, and due date.",
        })
        return
      }

      setIsSubmitting(true)

      await API.post(`/portal/${portalid}/tasks`, {
        title: newTask.title,
        description: newTask.description,
        dueDate: newTask.dueDate,
      })

      fetchTasks()
      setNewTask({ title: "", description: "", dueDate: "" })
      toast.success("Task added successfully!", {
        description: "The task has been created.",
      })
    } catch (error) {
      console.error("Error adding task:", error)
      toast.error("Failed to add task. Please try again.", {
        description: "An unexpected error occurred.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Update a task's details (Mentor only)
  const handleUpdateTask = async () => {
    if (sessionRole !== "mentor" || !editingTask) return

    try {
      setIsSubmitting(true)

      await API.put("/portal/updatetask", {
        portalId: portalid,
        taskId: editingTask._id,
        ...editingTask,
      })

      fetchTasks()
      setEditingTask(null)
      setShowEditDialog(false)
      toast.success("Task updated successfully!", {
        description: "The task has been updated.",
      })
    } catch (error) {
      console.error("Error updating task:", error)
      toast.error("Failed to update task. Please try again.", {
        description: "An unexpected error occurred.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Update a task's status (Student only)
  const handleUpdateTaskStatus = async (taskId, taskStatus) => {
    if (sessionRole !== "student") return

    try {
      await API.put("/portal/task/status", {
        portalId: portalid,
        taskId,
        taskStatus,
      })

      fetchTasks()
      toast.success("Task status updated successfully!", {
        description: "The task status has been updated.",
      })
    } catch (error) {
      console.error("Error updating task status:", error)
      toast.error("Failed to update task status. Please try again.", {
        description: "An unexpected error occurred.",
      })
    }
  }

  // Delete a task (Mentor only)
  const handleDeleteTask = async (taskId) => {
    if (sessionRole !== "mentor") return

    try {
      await API.delete("/portal/task/delete", {
        data: { portalId: portalid, taskId },
      })

      fetchTasks()
      toast.success("Task deleted successfully!", {
        description: "The task has been removed.",
      })
    } catch (error) {
      console.error("Error deleting task:", error)
      toast.error("Failed to delete task. Please try again.", {
        description: "An unexpected error occurred.",
      })
    }
  }

  const openEditDialog = (task) => {
    setEditingTask({
      ...task,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
    })
    setShowEditDialog(true)
  }

  if (isLoading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="text-lg font-medium text-gray-600">Loading tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Toaster for notifications */}
      <Toaster position="top-right" richColors />

      <div className="space-y-8">

        {/* Add Task Form (Mentor Only) */}
        {sessionRole === "mentor" && (
          <Card className="overflow-hidden border-0 shadow-md">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-primary" />
                Add New Task
              </CardTitle>
              <CardDescription>Create a new task for your student to complete</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleAddTask} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="task-title">Task Title</Label>
                    <Input
                      id="task-title"
                      type="text"
                      placeholder="Enter task title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="task-due-date">Due Date</Label>
                    <Input
                      id="task-due-date"
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-description">Description</Label>
                  <Input
                    id="task-description"
                    type="text"
                    placeholder="Enter task description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="mt-4" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Task
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Task List */}
        <Card className="overflow-hidden border-0 shadow-md">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  Task List
                </CardTitle>
                <CardDescription>
                  {tasks.length === 0
                    ? "No tasks have been created yet."
                    : `${tasks.length} task${tasks.length !== 1 ? "s" : ""} available`}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  {tasks.filter((task) => task.taskStatus === "Pending").length} Pending
                </Badge>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  {tasks.filter((task) => task.taskStatus === "Completed").length} Completed
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <AnimatePresence>
              {tasks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <ClipboardList className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No Tasks Yet</h3>
                  <p className="text-gray-500 max-w-md">
                    {sessionRole === "mentor"
                      ? "Create your first task for your student."
                      : "Your mentor hasn't assigned any tasks yet."}
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <motion.div
                      key={task._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card
                        className={`overflow-hidden transition-all duration-300 hover:shadow-md ${
                          task.taskStatus === "Completed"
                            ? "border-green-200 bg-green-50/30"
                            : "border-yellow-200 bg-yellow-50/30"
                        }`}
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold">{task.title}</h3>
                                <Badge
                                  variant={task.taskStatus === "Completed" ? "success" : "outline"}
                                  className={
                                    task.taskStatus === "Completed"
                                      ? "bg-green-100 text-green-800 border-green-200"
                                      : "bg-yellow-100 text-yellow-800 border-yellow-200"
                                  }
                                >
                                  {task.taskStatus}
                                </Badge>
                              </div>
                              <p className="text-gray-600">{task.description}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>
                                    {task.dueDate
                                      ? new Date(task.dueDate).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                        })
                                      : "No due date"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>
                                    Created{" "}
                                    {new Date(task.createdAt).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 md:flex-col md:items-end">
                              {sessionRole === "mentor" && (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="gap-1"
                                    onClick={() => openEditDialog(task)}
                                  >
                                    <Edit className="h-4 w-4" />
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="gap-1"
                                    onClick={() => handleDeleteTask(task._id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                  </Button>
                                </div>
                              )}
                              {sessionRole === "student" && (
                                <div>
                                  {task.taskStatus === "Pending" ? (
                                    <Button
                                      size="sm"
                                      variant="default"
                                      className="gap-1 bg-green-600 hover:bg-green-700"
                                      onClick={() => handleUpdateTaskStatus(task._id, "Completed")}
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                      Mark as Completed
                                    </Button>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="gap-1"
                                      onClick={() => handleUpdateTaskStatus(task._id, "Pending")}
                                    >
                                      <Undo2 className="h-4 w-4" />
                                      Mark as Pending
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

      {/* Edit Task Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                type="text"
                value={editingTask?.title || ""}
                onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                type="text"
                value={editingTask?.description || ""}
                onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-due-date">Due Date</Label>
              <Input
                id="edit-due-date"
                type="date"
                value={editingTask?.dueDate || ""}
                onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTask} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Add PropTypes validation
Tasks.propTypes = {
  sessionRole: PropTypes.oneOf(['student', 'mentor']).isRequired
};

export default Tasks
