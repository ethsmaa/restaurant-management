import { type UserRole } from "../enums/roles";

export type User = {
  user_id: number;
  name: string;
  password: string;
  email: string;
  role: UserRole;
};
