
import { LayoutGrid, Plus, Pencil } from "lucide-react";

interface BoardHeaderProps {
  title: string;
  taskCount: number;
  onAddTask: () => void;
  onRenameBoard: () => void;
}

export default function BoardHeader({
  title,
  taskCount,
  onAddTask,
  onRenameBoard,
}: BoardHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="rounded-xl bg-indigo-100 p-3 text-indigo-700">
          <LayoutGrid size={23} />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="break-words text-2xl font-bold text-gray-900">
              {title}
            </h1>

            <button
              onClick={onRenameBoard}
              aria-label="Rename board"
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
            >
              <Pencil size={15} />
            </button>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Manage your workflow · {taskCount}{" "}
            {taskCount === 1 ? "task" : "tasks"}
          </p>
        </div>
      </div>

      <button
        onClick={onAddTask}
        className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 font-medium text-white shadow-sm transition hover:bg-indigo-700"
      >
        <Plus size={18} />
        Add Task
      </button>
    </header>
  );
}
