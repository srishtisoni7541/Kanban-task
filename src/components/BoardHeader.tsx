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
      <div className="flex min-w-0 items-center gap-4">
        <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 p-3.5 text-white shadow-lg shadow-indigo-900/40">
          <LayoutGrid size={24} />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="break-words text-3xl font-extrabold tracking-tight text-white">
              {title}
            </h1>

            <button
              onClick={onRenameBoard}
              aria-label="Rename board"
              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white/10 hover:text-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              <Pencil size={15} />
            </button>
          </div>

          <p className="mt-1 flex items-center gap-2 text-sm text-slate-400">
            Manage your workflow
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-slate-200">
              {taskCount} {taskCount === 1 ? "task" : "tasks"}
            </span>
          </p>
        </div>
      </div>

      <button
        onClick={onAddTask}
        className="flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-900/40 transition hover:bg-indigo-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400/40 active:scale-95"
      >
        <Plus size={18} />
        Add Task
      </button>
    </header>
  );
}