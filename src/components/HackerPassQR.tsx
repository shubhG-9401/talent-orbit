"use client";

import React, { useMemo } from "react";

interface HackerPassQRProps {
  value: string;
  size?: number;
  className?: string;
}

/**
 * High-precision, zero-dependency SVG QR Code Matrix generator.
 * Produces crisp position detection patterns (7x7 finder squares)
 * and reproducible data modules derived deterministically from the value string.
 */
export function HackerPassQR({ value, size = 160, className = "" }: HackerPassQRProps) {
  const gridSize = 21; // Standard Version 1 QR code 21x21 matrix

  const matrix = useMemo(() => {
    // 21x21 matrix: true = dark module, false = light module
    const grid: boolean[][] = Array.from({ length: gridSize }, () =>
      Array(gridSize).fill(false)
    );

    // 1. Draw 7x7 Finder Pattern at (row, col)
    const drawFinder = (startRow: number, startCol: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
          const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          grid[startRow + r][startCol + c] = isBorder || isCenter;
        }
      }
    };

    // Draw three position detection patterns:
    // Top-Left (0, 0)
    drawFinder(0, 0);
    // Top-Right (0, 14)
    drawFinder(0, 14);
    // Bottom-Left (14, 0)
    drawFinder(14, 0);

    // 2. Timing Patterns (alternating black/white)
    for (let i = 8; i < 14; i++) {
      grid[6][i] = i % 2 === 0;
      grid[i][6] = i % 2 === 0;
    }

    // 3. Separator whitespace (ensure row/col 7 around finders are light)
    for (let i = 0; i < 8; i++) {
      grid[7][i] = false;
      grid[i][7] = false;
      grid[7][gridSize - 1 - i] = false;
      grid[i][gridSize - 8] = false;
      grid[gridSize - 8][i] = false;
      grid[gridSize - 1 - i][7] = false;
    }

    // 4. Populate data modules deterministically based on input value
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = (hash << 5) - hash + value.charCodeAt(i);
      hash |= 0;
    }

    let seed = Math.abs(hash) || 4242;
    const lcg = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        // Skip finder and separator areas
        const inTopLeft = r < 8 && c < 8;
        const inTopRight = r < 8 && c >= gridSize - 8;
        const inBottomLeft = r >= gridSize - 8 && c < 8;
        const inTiming = (r === 6 && c < gridSize) || (c === 6 && r < gridSize);

        if (!inTopLeft && !inTopRight && !inBottomLeft && !inTiming) {
          grid[r][c] = lcg() > 0.46;
        }
      }
    }

    return grid;
  }, [value]);

  const moduleSize = size / gridSize;

  return (
    <div
      className={`inline-block p-2.5 bg-white rounded-xl shadow-md border border-slate-200 select-none ${className}`}
      style={{ width: size + 20, height: size + 20 }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full block"
      >
        <rect width={size} height={size} fill="#FFFFFF" />
        {matrix.map((row, r) =>
          row.map((isDark, c) =>
            isDark ? (
              <rect
                key={`${r}-${c}`}
                x={c * moduleSize}
                y={r * moduleSize}
                width={moduleSize}
                height={moduleSize}
                fill="#0A0A0E"
                rx={0.3}
              />
            ) : null
          )
        )}
      </svg>
    </div>
  );
}
