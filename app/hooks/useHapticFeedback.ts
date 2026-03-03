"use client";

import { useCallback, useMemo } from "react";

/**
 * Custom hook for cross-platform haptic feedback.
 * Uses navigator.vibrate() on Android and the switch checkbox trick on iOS Safari 17.4+
 *
 * Based on: https://github.com/tijnjh/ios-haptics
 */
export function useHapticFeedback() {
  // Check if device supports haptics (touch device)
  const supportsHaptics = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches,
    []
  );

  // Check if we have native vibrate support (Android)
  const hasVibrate = useMemo(
    () =>
      typeof navigator !== "undefined" &&
      typeof navigator.vibrate === "function",
    []
  );

  // Single haptic pulse - creates fresh element each time (important for iOS)
  const trigger = useCallback(
    (duration: number = 50) => {
      try {
        // Try native vibration first (Android)
        if (hasVibrate) {
          navigator.vibrate(duration);
          return;
        }

        // Fall back to iOS switch checkbox trick
        // Must create fresh element each time for haptic to fire
        if (!supportsHaptics) return;

        const labelEl = document.createElement("label");
        labelEl.ariaHidden = "true";
        labelEl.style.display = "none";

        const inputEl = document.createElement("input");
        inputEl.type = "checkbox";
        inputEl.setAttribute("switch", ""); // Key for iOS haptic feedback

        labelEl.appendChild(inputEl);
        document.head.appendChild(labelEl);
        labelEl.click();
        document.head.removeChild(labelEl);
      } catch {
        // Silently fail
      }
    },
    [hasVibrate, supportsHaptics]
  );

  // Double haptic (confirmation)
  const confirm = useCallback(() => {
    if (hasVibrate) {
      navigator.vibrate([50, 70, 50]);
      return;
    }

    trigger();
    setTimeout(() => trigger(), 120);
  }, [hasVibrate, trigger]);

  // Triple haptic (error)
  const error = useCallback(() => {
    if (hasVibrate) {
      navigator.vibrate([50, 70, 50, 70, 50]);
      return;
    }

    trigger();
    setTimeout(() => trigger(), 120);
    setTimeout(() => trigger(), 240);
  }, [hasVibrate, trigger]);

  return {
    trigger,
    confirm,
    error,
    isSupported: hasVibrate || supportsHaptics,
  };
}
