"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useCheckInStore } from "./hooks/useCheckInStore";

const STORAGE_KEY_PREFIX = "stampley_checkin_state:";

function makeStorageKey(userId: string) {
  return `${STORAGE_KEY_PREFIX}${userId}`;
}

const CheckInUserIdContext = createContext<string | null>(null);

export function useCheckInUserId() {
  return useContext(CheckInUserIdContext);
}

export default function CheckInUserScope({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string | null;
}) {

  const affect = useCheckInStore((s) => s.affect);
  const contextTags = useCheckInStore((s) => s.contextTags);
  const narrative = useCheckInStore((s) => s.narrative);
  const focusDomain = useCheckInStore((s) => s.focusDomain);
  const activeSubscale = useCheckInStore((s) => s.activeSubscale);
  const needsSafetyEscalation = useCheckInStore((s) => s.needsSafetyEscalation);
  const suggestedNextDomain = useCheckInStore((s) => s.suggestedNextDomain);
  const previousDayDistress = useCheckInStore((s) => s.previousDayDistress);
  const consecutiveHighDistressDays = useCheckInStore((s) => s.consecutiveHighDistressDays);

  // Load persisted check-in state for this user.
  useEffect(() => {
    if (!userId) return;
    if (typeof window === "undefined") return;

    const raw = localStorage.getItem(makeStorageKey(userId));
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as any;
      useCheckInStore.setState({
        affect: parsed.affect,
        contextTags: parsed.contextTags,
        narrative: parsed.narrative,
        focusDomain: parsed.focusDomain,
        activeSubscale: parsed.activeSubscale,
        needsSafetyEscalation: parsed.needsSafetyEscalation,
        suggestedNextDomain: parsed.suggestedNextDomain,
        previousDayDistress: parsed.previousDayDistress,
        consecutiveHighDistressDays: parsed.consecutiveHighDistressDays,
        // Ensure transient flags don't get restored unexpectedly.
        isSubmitting: false,
      });
    } catch {
      // If parsing fails, ignore and start fresh.
    }
  }, [userId]);

  // Persist relevant check-in state for this user.
  useEffect(() => {
    if (!userId) return;
    if (typeof window === "undefined") return;

    const timeout = window.setTimeout(() => {
      const payload = {
        affect,
        contextTags,
        narrative,
        focusDomain,
        activeSubscale,
        needsSafetyEscalation,
        suggestedNextDomain,
        previousDayDistress,
        consecutiveHighDistressDays,
      };

      localStorage.setItem(makeStorageKey(userId), JSON.stringify(payload));
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [
    userId,
    affect,
    contextTags,
    narrative,
    focusDomain,
    activeSubscale,
    needsSafetyEscalation,
    suggestedNextDomain,
    previousDayDistress,
    consecutiveHighDistressDays,
  ]);

  return (
    <CheckInUserIdContext.Provider value={userId}>
      {children}
    </CheckInUserIdContext.Provider>
  );
}

