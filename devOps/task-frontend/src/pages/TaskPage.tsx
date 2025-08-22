import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import type { Task } from '../types/index';
import AddTaskForm from '../components/AddTaskForm';

export default function TaskPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const auth = useAuth();

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/tasks', {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      fetchTasks();
    }
  }, [auth?.token]);

  // 🔴 Delete Task handler
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      // Refresh task list after deletion
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Tasks</h1>

      <AddTaskForm onTaskAdded={fetchTasks} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onDelete={() => handleDelete(task.id)} // pass delete handler
          />
        ))}
      </div>
    </div>
  );
}
