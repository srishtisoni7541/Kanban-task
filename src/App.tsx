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
    <div className="min-h-screen bg-gray-50 md:flex">
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
            className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900">
              Create New Board
            </h2>

            <p className="mt-2 text-sm text-gray-500">
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
              className="mt-5 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateBoard}
                disabled={!newBoardTitle.trim()}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
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
