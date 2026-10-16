
import { useMemo, useState } from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useNavigate, useParams } from "react-router-dom";
import type { Board, Priority, Task, User } from "../types";
import BoardHeader from "../components/BoardHeader";
import FilterBar from "../components/FilterBar";
import KanbanColumn from "../components/KanbanColumn";
import TaskModel from "../components/TaskModel";

interface BoardPageProps {
  boards: Board[];
  setBoards: React.Dispatch<React.SetStateAction<Board[]>>;
  users: User[];
}

export default function BoardPage({
  boards,
  setBoards,
  users,
}: BoardPageProps) {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const board = boards.find((item) => item.id === boardId);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeColumnId, setActiveColumnId] = useState("");
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState<Priority | "All">("All");
  const [assigneeId, setAssigneeId] = useState("All");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const updateBoard = (updater: (current: Board) => Board) => {
    if (!board) return;

    setBoards((currentBoards) =>
      currentBoards.map((item) =>
        item.id === board.id ? updater(item) : item
      )
    );
  };

  const filteredTasks = useMemo(() => {
    if (!board) return {};

    const result: Record<string, Task[]> = {};

    for (const column of board.columns) {
      result[column.id] = column.taskIds
        .map((id) => board.tasks[id])
        .filter((task): task is Task => Boolean(task))
        .filter((task) => {
          const matchesSearch =
            task.title.toLowerCase().includes(search.toLowerCase()) ||
            task.description.toLowerCase().includes(search.toLowerCase());

          const matchesPriority =
            priority === "All" || task.priority === priority;

          const matchesAssignee =
            assigneeId === "All" ||
            (assigneeId === "Unassigned"
              ? task.assigneeId === null
              : task.assigneeId === Number(assigneeId));

          return matchesSearch && matchesPriority && matchesAssignee;
        });
    }

    return result;
  }, [board, search, priority, assigneeId]);

  function openCreateModal(columnId: string) {
    setEditingTask(null);
    setActiveColumnId(columnId);
    setModalOpen(true);
  }

  function openEditModal(task: Task) {
    setEditingTask(task);
    setActiveColumnId(task.columnId);
    setModalOpen(true);
  }

  function saveTask(task: Task) {
    updateBoard((current) => {
      const columns = current.columns.map((column) => {
        const alreadyHasTask = column.taskIds.includes(task.id);

        if (column.id === task.columnId && !alreadyHasTask) {
          return { ...column, taskIds: [...column.taskIds, task.id] };
        }

        if (column.id !== task.columnId && alreadyHasTask) {
          return {
            ...column,
            taskIds: column.taskIds.filter((id) => id !== task.id),
          };
        }

        return column;
      });

      return {
        ...current,
        columns,
        tasks: { ...current.tasks, [task.id]: task },
      };
    });
  }

  function deleteTask(taskId: string) {
    if (!window.confirm("Delete this task?")) return;

    updateBoard((current) => {
      const tasks = { ...current.tasks };
      delete tasks[taskId];

      return {
        ...current,
        tasks,
        columns: current.columns.map((column) => ({
          ...column,
          taskIds: column.taskIds.filter((id) => id !== taskId),
        })),
      };
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!board || !over || active.id === over.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const sourceColumn = board.columns.find((column) =>
      column.taskIds.includes(activeId)
    );

    const destinationColumn =
      board.columns.find((column) => column.id === overId) ??
      board.columns.find((column) => column.taskIds.includes(overId));

    if (!sourceColumn || !destinationColumn) return;

    updateBoard((current) => {
      const columns = current.columns.map((column) => ({
        ...column,
        taskIds: [...column.taskIds],
      }));

      const source = columns.find((column) => column.id === sourceColumn.id)!;
      const destination = columns.find(
        (column) => column.id === destinationColumn.id
      )!;

      if (source.id === destination.id) {
        const oldIndex = source.taskIds.indexOf(activeId);
        const newIndex = source.taskIds.indexOf(overId);

        if (oldIndex !== -1 && newIndex !== -1) {
          source.taskIds = arrayMove(source.taskIds, oldIndex, newIndex);
        }
      } else {
        source.taskIds = source.taskIds.filter((id) => id !== activeId);

        const overIndex = destination.taskIds.indexOf(overId);
        const insertAt = overIndex < 0 ? destination.taskIds.length : overIndex;

        destination.taskIds.splice(insertAt, 0, activeId);
      }

      return {
        ...current,
        columns,
        tasks: {
          ...current.tasks,
          [activeId]: {
            ...current.tasks[activeId],
            columnId: destination.id,
          },
        },
      };
    });
  }

  function renameBoard() {
    if (!board) return;

    const title = window.prompt("Enter board name", board.title);
    if (!title?.trim()) return;

    updateBoard((current) => ({
      ...current,
      title: title.trim(),
    }));
  }

  if (!board) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 p-6">
        <h2 className="text-xl font-bold">Board not found</h2>
        <button
          onClick={() => navigate("/")}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-white"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const taskCount = Object.keys(board.tasks).length;

  return (
    <main className="min-w-0 flex-1 bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <button
          onClick={() => navigate("/")}
          className="text-sm text-indigo-600 hover:underline"
        >
          ← All Boards
        </button>

        <BoardHeader
          title={board.title}
          taskCount={taskCount}
          onAddTask={() => openCreateModal(board.columns[0]?.id ?? "")}
          onRenameBoard={renameBoard}
        />

        <FilterBar
          search={search}
          setSearch={setSearch}
          priority={priority}
          setPriority={setPriority}
          assigneeId={assigneeId}
          setAssigneeId={setAssigneeId}
          users={users}
        />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <div className="flex items-start gap-4 overflow-x-auto pb-5">
            {board.columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={filteredTasks[column.id] ?? []}
                users={users}
                onAddTask={openCreateModal}
                onEditTask={openEditModal}
                onDeleteTask={deleteTask}
              />
            ))}
          </div>
        </DndContext>
      </div>

      {modalOpen && (
        <TaskModel
          users={users}
          task={editingTask}
          columnId={activeColumnId}
          onClose={() => setModalOpen(false)}
          onSave={saveTask}
        />
      )}
    </main>
  );
}
