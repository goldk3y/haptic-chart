"use client";

import { useCallback } from "react";
import { Liveline } from "liveline";
import { useWebHaptics } from "web-haptics/react";
import { usePriceSimulation } from "../hooks/usePriceSimulation";

interface HapticChartProps {
  theme: "light" | "dark";
}

export function HapticChart({ theme }: HapticChartProps) {
  const { trigger } = useWebHaptics({ debug: false });

  // Calculate haptic duration based on price change magnitude
  const handlePriceChange = useCallback(
    ({ percentChange }: { percentChange: number }) => {
      let duration: number;

      if (percentChange >= 1) {
        // Large change (>1%): strong feedback
        duration = 80 + Math.min(percentChange * 10, 40); // 80-120ms
      } else if (percentChange >= 0.5) {
        // Medium change (0.5-1%): nudge
        duration = 50;
      } else {
        // Small change (<0.5%): light tap
        duration = 30;
      }

      trigger(duration);
    },
    [trigger]
  );

  const { data, value } = usePriceSimulation({
    initialPrice: 100,
    minInterval: 150,
    maxInterval: 1200,
    volatility: 0.008,
    onPriceChange: handlePriceChange,
  });

  return (
    <div className="w-full h-[500px] sm:h-[350px]">
      <Liveline
        data={data}
        value={value}
        theme={theme}
        color="#10b981"
        badge
        pulse
        fill
        grid
        scrub
        momentum
        window={30}
        lerpSpeed={0.12}
        formatValue={(v) =>
          `$${v.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`
        }
      />
    </div>
  );
}
