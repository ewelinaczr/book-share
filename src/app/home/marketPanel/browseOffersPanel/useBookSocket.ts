import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Session } from "next-auth";

export function useBookSocket(session?: Session | null) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!session) return;

    socketRef.current = io(
      process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
      {
        auth: { accessToken: session.token },
      }
    );

    return () => {
      socketRef.current?.disconnect();
    };
  }, [session]);

  return socketRef;
}
