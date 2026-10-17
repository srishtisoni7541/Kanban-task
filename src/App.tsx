import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import BoardPage from "./pages/BoardPage";
import { createDefaultBoard, createId } from "./utils/taskHelpers";
import { getUsers } from "./services/userService";
import type { Board, User } from "./types";
import { useLocalStorage } from "./hooks/uselocalStorage";

function AppContent() {
  const [boards, setBoards] = useLocalStorage<Board[]>("taskflow-boards", []);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");

  const [users, setUsers] = useState<User[]>([]);
  const [apiError, setApiError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const activeBoardId =
    location.pathname.match(/^\/boards\/([^/]+)/)?.[1] ?? "";

  useEffect(() => {
    let cancelled = false;

    getUsers()
      .then((data) => {
        if (!cancelled) {
          setUsers(data);
          setApiError("");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setApiError(
            "Assignee data could not load. Check your internet connection.",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function createBoard() {
    setNewBoardTitle("");
    setShowCreateModal(true);
  }

  function handleCreateBoard() {
    const title = newBoardTitle.trim();

    if (!title) return;

    const newBoard = createDefaultBoard();
    newBoard.id = createId();
    newBoard.title = title;

    setBoards((current) => [...current, newBoard]);

    setShowCreateModal(false);
    setNewBoardTitle("");

    navigate(`/boards/${newBoard.id}`);
  }
  function deleteBoard(boardId: string) {
    setBoards((current) => current.filter((board) => board.id !== boardId));

    if (activeBoardId === boardId) {
      navigate("/");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 md:flex">
      <Sidebar
        boards={boards}
        activeBoardId={activeBoardId}
        onSelectBoard={(boardId) => {
          navigate(boardId ? `/boards/${boardId}` : "/");
        }}
        onCreateBoard={createBoard}
      />

      <div className="min-w-0 flex-1">
        {apiError && (
          <div
            role="status"
            className="border-b border-amber-400/20 bg-amber-500/10 px-4 py-2.5 text-sm font-medium text-amber-300"
          >
            {apiError}
          </div>
        )}

        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                boards={boards}
                onCreateBoard={createBoard}
                onDeleteBoard={deleteBoard}
              />
            }
          />

          <Route
            path="/boards/:boardId"
            element={
              <BoardPage boards={boards} setBoards={setBoards} users={users} />
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 p-7 shadow-2xl ring-1 ring-white/10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300">
              <Plus size={24} />
            </div>

            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-100">
              Create New Board
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Enter a name for your new project board.
            </p>

            <input
              autoFocus
              type="text"
              placeholder="e.g. Website Development"
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateBoard();
                if (e.key === "Escape") setShowCreateModal(false);
              }}
              className="mt-5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/30"
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateBoard}
                disabled={!newBoardTitle.trim()}
                className="rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-900/40 transition hover:bg-indigo-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400/40 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
              >
                Create Board
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}