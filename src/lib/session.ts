import { getIronSession, type SessionOptions } from "iron-session";

export type Session = {
  user: {
    id: number;
    name: string;
    role: "customer" | "restaurant_owner" | "admin";
  } | null;
};

export const defaultSession: Session = {
  user: null,
};

export const sessionOptions: SessionOptions = {
  password: "complex_password_at_least_32_characters_long",
  cookieName: "restaurant_app_session",
  cookieOptions: {
    // secure only works in `https` environments
    // if your localhost is not on `https`, then use: `secure: process.env.NODE_ENV === "production"`
    secure: process.env.NODE_ENV === "production",
  },
};

/**
 * This function only works in the server-side. 
 * @returns {Promise<Session>}
 */
export const getSession = async () => {
  const { cookies } = await import("next/headers");

  return await getIronSession<Session>(await cookies(), sessionOptions);
};
