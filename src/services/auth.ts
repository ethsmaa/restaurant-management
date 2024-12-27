// yetkilenirme islemleri buraya yapilacak:

import { getSession } from "~/lib/session";
import { UserRole } from "~/lib/enums/roles";

export async function ensureOwnerRole() {
  const session = await getSession();
  if (!session?.user || session.user.role !== UserRole.OWNER) {
    throw new Error("Yetkisiz erişim");
  }
  return session.user;
}

export async function ensureCustomerRole() {
  const session = await getSession();
  if (!session?.user || session.user.role !== UserRole.CUSTOMER) {
    throw new Error("Yetkisiz erişim");
  }
  return session.user;
}

export async function ensureAdminRole() {
  const session = await getSession();
  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    throw new Error("Yetkisiz erişim");
  }
  return session.user;
}

export async function ensureAuthenticated() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Yetkisiz erişim");
  }
  return session.user;
}

export async function ensureRole(role: UserRole) {
  const session = await getSession();
  if (!session?.user || session.user.role !== role) {
    throw new Error("Yetkisiz erişim");
  }
  return session.user;
}
