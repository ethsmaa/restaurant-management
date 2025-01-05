import { getConnection } from "~/lib/database";
import { getSession } from "~/lib/session";
import type { RowDataPacket } from "mysql2";
import type { User } from "~/lib/types/user";

/**
 * Kullanıcı bilgilerini getirir.
 * @returns {Promise<User | null>} Kullanıcı bilgileri veya null
 */
export async function fetchUser(): Promise<User | null> {
  const session = await getSession();

  if (!session.user) {
    throw new Error("Unauthorized");
  }

  const db = await getConnection();
  const [results] = await db.query<(User & RowDataPacket)[]>(
    "SELECT user_id, name, email FROM Users WHERE user_id = ?",
    [session.user.id]
  );

  return results.length > 0 ? (results[0] as User) : null;
}

/**
 * Kullanıcı bilgilerini günceller.
 * @param {Partial<User>} updatedData Güncellenmek istenen kullanıcı bilgileri
 * @returns {Promise<void>}
 */
export async function updateUser(updatedData: Partial<User>): Promise<void> {
  const session = await getSession();

  if (!session.user) {
    throw new Error("Unauthorized");
  }

  const { name, email, password } = updatedData;

  if (!name || !email) {
    throw new Error("Name and email are required");
  }

  const db = await getConnection();

  if (password) {
    await db.query(
      "UPDATE Users SET name = ?, email = ?, password = ? WHERE user_id = ?",
      [name, email, password, session.user.id]
    );
  } else {
    await db.query(
      "UPDATE Users SET name = ?, email = ? WHERE user_id = ?",
      [name, email, session.user.id]
    );
  }
}


/**
 * kullanıcıyı siler
 * @returns {Promise<void>}
 * 
 */

export async function deleteUser(): Promise<void> {
  const session = await getSession();

  if (!session.user) {
    throw new Error("Unauthorized");
  }

  const db = await getConnection();
  await db.query("DELETE FROM Users WHERE user_id = ?", [session.user.id]);
  
}