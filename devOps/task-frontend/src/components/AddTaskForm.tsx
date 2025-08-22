import { useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { PlusCircle } from 'lucide-react';

interface Props {
  onTaskAdded: () => void;
}

export default function AddTaskForm({ onTaskAdded }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) return;

    try {
      await axios.post(
        '/tasks',
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );
      setTitle('');
      setDescription('');
      onTaskAdded();
    } catch (err) {
      console.error('Failed to add task', err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-2xl p-6 mb-6 border border-gray-100"
    >
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Add New Task</h2>

      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 mb-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
      />

      <textarea
        placeholder="Task description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 mb-4 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        rows={3}
      />

      <button
        type="submit"
        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-sm transition-all w-full"
      >
        <PlusCircle className="w-5 h-5" />
        Add Task
      </button>
    </form>
  );
}
