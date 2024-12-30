import { type UserRole } from "../enums/roles";

export type User = {
  user_id: number;
  name: string;
  password: string;
  email: string;
  role: UserRole;
};


export type EditableUser = Pick<User, "name" | "email" | "password">;