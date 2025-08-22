import type { Task } from '../types';
import { CalendarDays, FileText, ClipboardCheck, Trash2 } from 'lucide-react';

export default function TaskCard({ task, onDelete }: { task: Task; onDelete: () => void }) {
  return (
    <div className="relative group bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-md border border-gray-200/60 shadow-md rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center gap-3 mb-3">
        <ClipboardCheck className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
        <h2 className="font-bold text-lg md:text-xl text-gray-800">{task.title}</h2>
      </div>

      <div className="flex items-start gap-2 text-gray-600 mb-4">
        <FileText className="w-5 h-5 mt-0.5 text-gray-400" />
        <p className="text-sm md:text-base">{task.description}</p>
      </div>

      <div className="flex items-center justify-between text-xs md:text-sm text-gray-500 border-t pt-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-gray-400" />
          <span>Created: {new Date(task.createdAt).toLocaleString()}</span>
        </div>

        {/* Delete button */}
        <button onClick={onDelete} className="text-red-500 hover:text-red-700 flex items-center gap-1">
          <Trash2 className="w-4 h-4" /> Delete
        </button>
      </div>
    </div>
  );
}
