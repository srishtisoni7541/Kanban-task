
import { LayoutDashboard, Plus, CheckSquare } from "lucide-react";
import type { Board } from "../types";

interface SidebarProps {
  boards: Board[];
  activeBoardId: string;
  onSelectBoard: (boardId: string) => void;
  onCreateBoard: () => void;
}

export default function Sidebar({
  boards,
  activeBoardId,
  onSelectBoard,
  onCreateBoard,
}: SidebarProps) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-gray-200 bg-white p-4 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-indigo-600 p-2.5 text-white">
          <CheckSquare size={23} />
        </div>

        <div>
          <h1 className="text-xl font-bold text-gray-900">
            TaskFlow
          </h1>
          <p className="text-xs text-gray-500">
            Work, organized.
          </p>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Workspace
        </span>

        <button
          onClick={onCreateBoard}
          aria-label="Create board"
          className="rounded-md p-1.5 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600"
        >
          <Plus size={17} />
        </button>
      </div>

      <button
        onClick={() => onSelectBoard("")}
        className="mb-3 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-100"
      >
        <LayoutDashboard size={18} />
        All Boards
      </button>

      <nav className="flex flex-col gap-1 md:flex-1">
        {boards.map((board) => (
          <button
            key={board.id}
            onClick={() => onSelectBoard(board.id)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
              activeBoardId === board.id
                ? "bg-indigo-50 font-semibold text-indigo-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <LayoutDashboard size={17} />
            <span className="truncate">{board.title}</span>
          </button>
        ))}
      </nav>

      <p className="mt-6 hidden text-xs text-gray-400 md:block">
        TaskFlow · Stay productive
      </p>
    </aside>
  );
}
