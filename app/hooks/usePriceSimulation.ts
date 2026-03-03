"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { LivelinePoint } from "liveline";

interface PriceChange {
  oldValue: number;
  newValue: number;
  percentChange: number;
}

interface UsePriceSimulationOptions {
  initialPrice?: number;
  minInterval?: number;
  maxInterval?: number;
  volatility?: number;
  onPriceChange?: (change: PriceChange) => void;
}

export function usePriceSimulation({
  initialPrice = 100,
  minInterval = 150,
  maxInterval = 1200,
  volatility = 0.008,
  onPriceChange,
}: UsePriceSimulationOptions = {}) {
  const [data, setData] = useState<LivelinePoint[]>([]);
  const [value, setValue] = useState(initialPrice);
  const priceRef = useRef(initialPrice);
  const onPriceChangeRef = useRef(onPriceChange);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Keep callback ref updated
  useEffect(() => {
    onPriceChangeRef.current = onPriceChange;
  }, [onPriceChange]);

  // Initialize with starting data point
  useEffect(() => {
    const now = Date.now() / 1000;
    setData([{ time: now, value: initialPrice }]);
    setValue(initialPrice);
    priceRef.current = initialPrice;
  }, [initialPrice]);

  // Price simulation loop with random timing
  useEffect(() => {
    const getRandomInterval = () => {
      // Weighted random: more balanced pacing
      const rand = Math.random();
      if (rand < 0.2) {
        // 20% chance: fast (150-300ms)
        return minInterval + Math.random() * 150;
      } else if (rand < 0.6) {
        // 40% chance: medium (300-600ms)
        return 300 + Math.random() * 300;
      } else {
        // 40% chance: slow (600-1200ms) - pauses
        return 600 + Math.random() * (maxInterval - 600);
      }
    };

    const tick = () => {
      const now = Date.now() / 1000;
      const oldPrice = priceRef.current;

      // Random walk with variable step size for interesting movements
      const randomFactor = Math.random();
      const stepSize = randomFactor < 0.1
        ? volatility * 3  // 10% chance of big move
        : randomFactor < 0.3
          ? volatility * 1.5  // 20% chance of medium move
          : volatility;  // 70% chance of small move

      const change = (Math.random() - 0.5) * 2 * stepSize;
      const newPrice = Math.max(0.01, oldPrice * (1 + change));

      priceRef.current = newPrice;
      setValue(newPrice);

      setData((prev) => {
        const newPoint = { time: now, value: newPrice };
        // Keep last 300 points
        const trimmed = prev.length > 300 ? prev.slice(-299) : prev;
        return [...trimmed, newPoint];
      });

      // Notify about price change
      const percentChange = Math.abs((newPrice - oldPrice) / oldPrice) * 100;
      onPriceChangeRef.current?.({
        oldValue: oldPrice,
        newValue: newPrice,
        percentChange,
      });

      // Schedule next tick with random interval
      timeoutRef.current = setTimeout(tick, getRandomInterval());
    };

    // Start the loop
    timeoutRef.current = setTimeout(tick, getRandomInterval());

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [minInterval, maxInterval, volatility]);

  return { data, value };
}
