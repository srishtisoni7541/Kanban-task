
import type { Board, Task } from "../types";

export function createId(): string {
  return crypto.randomUUID();
}

export function createDefaultBoard(): Board {
  const todoId = createId();
  const progressId = createId();
  const doneId = createId();

  return {
    id: createId(),
    title: "My First Board",
    columns: [
      { id: todoId, title: "To Do", taskIds: [] },
      { id: progressId, title: "In Progress", taskIds: [] },
      { id: doneId, title: "Done", taskIds: [] },
    ],
    tasks: {},
  };
}

export function getTaskById(
  board: Board,
  taskId: string
): Task | undefined {
  return board.tasks[taskId];
}
