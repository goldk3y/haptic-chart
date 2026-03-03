"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Custom hook for cross-platform haptic feedback.
 * Uses navigator.vibrate() on Android and the switch checkbox trick on iOS Safari 17.4+
 */
export function useHapticFeedback() {
  const labelRef = useRef<HTMLLabelElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Check if device supports haptics (touch device)
  const supportsHaptics =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  // Check if we have native vibrate support (Android)
  const hasVibrate =
    typeof navigator !== "undefined" &&
    typeof navigator.vibrate === "function";

  // Create persistent hidden switch checkbox for iOS haptics
  useEffect(() => {
    if (typeof document === "undefined") return;

    // Create label element
    const label = document.createElement("label");
    label.ariaHidden = "true";
    label.style.cssText =
      "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;";

    // Create input with switch attribute (key for iOS haptics)
    const input = document.createElement("input");
    input.type = "checkbox";
    input.setAttribute("switch", ""); // This enables iOS haptic feedback!
    input.tabIndex = -1;

    label.appendChild(input);
    document.body.appendChild(label);

    labelRef.current = label;
    inputRef.current = input;

    return () => {
      if (label.parentNode) {
        label.parentNode.removeChild(label);
      }
    };
  }, []);

  // Single haptic pulse
  const trigger = useCallback(
    (duration: number = 50) => {
      try {
        // Try native vibration first (Android)
        if (hasVibrate) {
          navigator.vibrate(duration);
          return;
        }

        // Fall back to iOS switch checkbox trick
        if (supportsHaptics && labelRef.current) {
          labelRef.current.click();
        }
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
