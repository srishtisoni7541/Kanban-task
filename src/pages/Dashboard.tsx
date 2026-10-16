
import { LayoutGrid, Plus, ArrowRight, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Board } from "../types";

interface DashboardProps {
  boards: Board[];
  onCreateBoard: () => void;
  onDeleteBoard: (boardId: string) => void;
}

export default function Dashboard({
  boards,
  onCreateBoard,
  onDeleteBoard,
}: DashboardProps) {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex-1 bg-gray-50 p-5 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-indigo-600">
              WORKSPACE OVERVIEW
            </p>
            <h1 className="text-3xl font-bold text-gray-900">
              My Boards
            </h1>
            <p className="mt-2 text-gray-500">
              All your projects, in one place.
            </p>
          </div>

          <button
            onClick={onCreateBoard}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700"
          >
            <Plus size={19} />
            Create Board
          </button>
        </header>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">Total boards</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {boards.length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">Total tasks</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {boards.reduce(
                (total, board) =>
                  total + Object.keys(board.tasks).length,
                0
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">Completed tasks</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {boards.reduce(
                (total, board) =>
                  total +
                  board.columns
                    .filter((column) =>
                      column.title.toLowerCase().includes("done")
                    )
                    .reduce(
                      (count, column) => count + column.taskIds.length,
                      0
                    ),
                0
              )}
            </p>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <LayoutGrid size={20} className="text-gray-500" />
          <h2 className="font-semibold text-gray-800">
            Your workspace
          </h2>
        </div>

        {boards.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white px-5 py-16 text-center">
            <LayoutGrid
              size={36}
              className="mx-auto mb-4 text-gray-400"
            />
            <h3 className="text-lg font-semibold text-gray-800">
              No boards yet
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Create your first board to start organizing tasks.
            </p>
            <button
              onClick={onCreateBoard}
              className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Create your first board
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {boards.map((board) => (
              <article
                key={board.id}
                className="group rounded-2xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg"
              >
                <div className="mb-5 flex items-start justify-between">
                  <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                    <LayoutGrid size={22} />
                  </div>

                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `Delete "${board.title}" and all its tasks?`
                        )
                      ) {
                        onDeleteBoard(board.id);
                      }
                    }}
                    aria-label={`Delete ${board.title}`}
                    className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>

                <h3 className="break-words text-lg font-bold text-gray-900">
                  {board.title}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  {Object.keys(board.tasks).length} tasks ·{" "}
                  {board.columns.length} columns
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {board.columns.map((column) => (
                    <span
                      key={column.id}
                      className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600"
                    >
                      {column.title}: {column.taskIds.length}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => navigate(`/boards/${board.id}`)}
                  className="mt-6 flex w-full items-center justify-between rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:border-indigo-600 hover:text-indigo-600"
                >
                  Open board
                  <ArrowRight
                    size={17}
                    className="transition group-hover:translate-x-1"
                  />
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
