import { LayoutGrid, Plus, ArrowRight, Trash2, CheckCircle2, ListTodo } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Board } from "../types";
import { useState } from "react";

interface DashboardProps {
  boards: Board[];
  onCreateBoard: () => void;
  onDeleteBoard: (boardId: string) => void;
}

// Full class names so Tailwind can detect them
const ACCENTS = [
  { bar: "bg-indigo-500", icon: "bg-indigo-500/15 text-indigo-300", fill: "bg-indigo-500" },
  { bar: "bg-emerald-500", icon: "bg-emerald-500/15 text-emerald-300", fill: "bg-emerald-500" },
  { bar: "bg-amber-500", icon: "bg-amber-500/15 text-amber-300", fill: "bg-amber-500" },
  { bar: "bg-rose-500", icon: "bg-rose-500/15 text-rose-300", fill: "bg-rose-500" },
  { bar: "bg-sky-500", icon: "bg-sky-500/15 text-sky-300", fill: "bg-sky-500" },
  { bar: "bg-violet-500", icon: "bg-violet-500/15 text-violet-300", fill: "bg-violet-500" },
];

const doneCount = (board: Board) =>
  board.columns
    .filter((column) => column.title.toLowerCase().includes("done"))
    .reduce((count, column) => count + column.taskIds.length, 0);

export default function Dashboard({
  boards,
  onCreateBoard,
  onDeleteBoard,
}: DashboardProps) {
  const navigate = useNavigate();
  const [boardToDelete, setBoardToDelete] = useState<Board | null>(null);

  const totalTasks = boards.reduce(
    (total, board) => total + Object.keys(board.tasks).length,
    0,
  );
  const completedTasks = boards.reduce(
    (total, board) => total + doneCount(board),
    0,
  );

  return (
    <main className="min-h-screen flex-1 bg-slate-950">
      {/* Hero */}
      <section className="bg-gradient-to-b from-indigo-950 to-slate-950 px-5 pb-28 pt-10 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-indigo-200">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Workspace overview
              </p>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                My Boards
              </h1>
              <p className="mt-3 text-lg text-slate-400">
                All your projects, in one place.
              </p>
            </div>

            <button
              onClick={onCreateBoard}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-900/40 transition hover:bg-indigo-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400/40 active:scale-95"
            >
              <Plus size={19} />
              Create Board
            </button>
          </header>
        </div>
      </section>

      <div className="mx-auto -mt-20 max-w-6xl px-5 pb-12 sm:px-8">
        {/* Stats */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl bg-slate-900 p-5 shadow-xl shadow-black/30 ring-1 ring-white/10">
            <div className="rounded-xl bg-indigo-500/15 p-3 text-indigo-300">
              <LayoutGrid size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total boards</p>
              <p className="text-3xl font-extrabold text-slate-100">
                {boards.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl bg-slate-900 p-5 shadow-xl shadow-black/30 ring-1 ring-white/10">
            <div className="rounded-xl bg-amber-500/15 p-3 text-amber-300">
              <ListTodo size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total tasks</p>
              <p className="text-3xl font-extrabold text-slate-100">
                {totalTasks}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl bg-slate-900 p-5 shadow-xl shadow-black/30 ring-1 ring-white/10">
            <div className="rounded-xl bg-emerald-500/15 p-3 text-emerald-300">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-400">Completed tasks</p>
              <p className="text-3xl font-extrabold text-emerald-400">
                {completedTasks}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-5 flex items-center gap-2">
          <LayoutGrid size={20} className="text-slate-400" />
          <h2 className="text-lg font-bold text-slate-100">Your workspace</h2>
        </div>

        {boards.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-slate-700 bg-slate-900 px-5 py-20 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300">
              <LayoutGrid size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-100">No boards yet</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
              Create your first board to start organizing tasks.
            </p>
            <button
              onClick={onCreateBoard}
              className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 font-medium text-white shadow-md transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300 active:scale-95"
            >
              Create your first board
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {boards.map((board, index) => {
              const accent = ACCENTS[index % ACCENTS.length];
              const taskCount = Object.keys(board.tasks).length;
              const done = doneCount(board);
              const progress = taskCount === 0 ? 0 : Math.round((done / taskCount) * 100);

              return (
                <article
                  key={board.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl bg-slate-900 shadow-md ring-1 ring-white/10 transition duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 hover:ring-white/20"
                >
                  <div className={`h-1.5 w-full ${accent.bar}`} />

                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-5 flex items-start justify-between">
                      <div className={`rounded-xl p-3 ${accent.icon}`}>
                        <LayoutGrid size={22} />
                      </div>

                      <button
                        onClick={() => setBoardToDelete(board)}
                        aria-label={`Delete ${board.title}`}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-red-500/20 hover:text-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    <h3 className="break-words text-xl font-bold text-slate-100">
                      {board.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      {taskCount} tasks · {board.columns.length} columns
                    </p>

                    {/* Progress */}
                    <div className="mt-5">
                      <div className="mb-1.5 flex justify-between text-xs font-medium text-slate-400">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className={`h-full rounded-full transition-all ${accent.fill}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {board.columns.map((column) => (
                        <span
                          key={column.id}
                          className="rounded-full bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300"
                        >
                          {column.title}: {column.taskIds.length}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => navigate(`/boards/${board.id}`)}
                      className="mt-6 flex w-full items-center justify-between rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300"
                    >
                      Open board
                      <ArrowRight
                        size={17}
                        className="transition group-hover:translate-x-1"
                      />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {boardToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            className="w-full max-w-md rounded-3xl bg-slate-900 p-7 shadow-2xl ring-1 ring-white/10"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15 text-red-300">
              <Trash2 size={26} />
            </div>

            <h2
              id="delete-dialog-title"
              className="mt-5 text-2xl font-bold text-slate-100"
            >
              Delete Board?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-100">
                "{boardToDelete.title}"
              </span>
              ? This action will remove the board and all its tasks.
            </p>

            <div className="mt-7 flex justify-end gap-3">
              <button
                onClick={() => setBoardToDelete(null)}
                className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  onDeleteBoard(boardToDelete.id);
                  setBoardToDelete(null);
                }}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-red-700 active:scale-95"
              >
                Delete Board
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}