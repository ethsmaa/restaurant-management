"use client";
import { useState, useEffect } from "react";
import { defaultSession, type Session } from "~/lib/session";

/**
 * This hook is used to get the session information of the user.
 * @returns {{session: Session, loading: boolean, isLogged: boolean}}
 */
export const useSession = () => {
  const [session, setSession] = useState<Session>(defaultSession);
  const [loading, setLoading] = useState(true);

  const fetchSession = async () => {
    const response = await fetch("/api/session");
    const data = (await response.json()) as Session;

    setSession(data);
    setLoading(false);
  };

  useEffect(() => {
    void fetchSession();
  }, []); // useEffect kullanmamizin sebebi: sayfa yenilendiginde tekrar tekrar session bilgilerini cekmemek icin

  return { session, loading, isLogged: session.user !== null };
};
