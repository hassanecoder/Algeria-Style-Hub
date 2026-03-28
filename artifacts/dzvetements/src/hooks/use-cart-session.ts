import { useEffect, useState } from "react";
import { generateSessionId } from "@/lib/utils";

export function useCartSession() {
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    setSessionId(generateSessionId());
  }, []);

  return sessionId;
}
