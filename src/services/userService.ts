
import type { User } from "../types";

interface DummyJSONResponse {
  users: User[];
}

export async function getUsers(): Promise<User[]> {
  const response = await fetch(
    "https://dummyjson.com/users?limit=100"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  const data: DummyJSONResponse = await response.json();

  return data.users;
}
