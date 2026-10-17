import { LayoutDashboard, Plus, CheckSquare } from "lucide-react";
import type { Board } from "../types";

interface SidebarProps {
  boards: Board[];
  activeBoardId: string;
  onSelectBoard: (boardId: string) => void;
  onCreateBoard: () => void;
}

// Same color order as the Dashboard board cards
const DOTS = [
  "bg-indigo-400",
  "bg-emerald-400",
  "bg-amber-400",
  "bg-rose-400",
  "bg-sky-400",
  "bg-violet-400",
];

export default function Sidebar({
  boards,
  activeBoardId,
  onSelectBoard,
  onCreateBoard,
}: SidebarProps) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-slate-800 bg-slate-900 p-4 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 p-2.5 text-white shadow-lg shadow-indigo-900/40">
          <CheckSquare size={23} />
        </div>

        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-white">
            TaskFlow
          </h1>
          <p className="text-xs text-slate-400">Work, organized.</p>
        </div>
      </div>

      <div className="mb-2 flex items-center justify-between px-1">
        <span className="text-sm font-semibold text-slate-500">Workspace</span>

        <button
          onClick={onCreateBoard}
          aria-label="Create board"
          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <Plus size={17} />
        </button>
      </div>

      <button
        onClick={() => onSelectBoard("")}
        className="mb-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
      >
        <LayoutDashboard size={18} />
        All Boards
      </button>

      <nav className="flex flex-col gap-1 md:flex-1">
        {boards.map((board, index) => {
          const active = activeBoardId === board.id;
          return (
            <button
              key={board.id}
              onClick={() => onSelectBoard(board.id)}
              className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                active
                  ? "bg-indigo-500/20 font-semibold text-white"
                  : "text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-indigo-400" />
              )}
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${DOTS[index % DOTS.length]}`}
              />
              <span className="truncate">{board.title}</span>
            </button>
          );
        })}
      </nav>

      <p className="mt-6 hidden text-xs text-slate-600 md:block">
        TaskFlow · Stay productive
      </p>
    </aside>
  );
}