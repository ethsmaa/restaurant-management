"use client";
import { useState, useEffect } from "react";
import { defaultSession, Session } from "~/lib/session";

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
  }, []);

  return { session, loading, isLogged: session.user !== null };
};
