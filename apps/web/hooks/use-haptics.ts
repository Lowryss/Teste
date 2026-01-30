"use client";

import { useCallback } from "react";

export function useHaptics() {
    const triggerHaptic = useCallback((pattern: number | number[] = 10) => {
        if (typeof window !== "undefined" && navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    }, []);

    return { triggerHaptic };
}
