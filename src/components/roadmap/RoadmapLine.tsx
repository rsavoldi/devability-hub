
"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface RoadmapLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  status: 'completed' | 'in-progress' | 'not-started';
  isBold?: boolean; // For current path segment
}

const RoadmapLine: React.FC<RoadmapLineProps> = ({ x1, y1, x2, y2, status, isBold }) => {
  const statusColors = {
    completed: 'stroke-green-500',
    'in-progress': 'stroke-yellow-500',
    'not-started': 'stroke-border',
  };

  // Calculate control points for a slight curve
  // This creates a simple horizontal curve. For zig-zag, it might need adjustment.
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  // Perpendicular direction for control point offset
  const controlOffset = Math.sqrt(dx*dx + dy*dy) * 0.1; // Adjust curve intensity
  const cp1x = midX - dy * 0.1; // Offset perpendicular to the line
  const cp1y = midY + dx * 0.1;
  const cp2x = midX - dy * 0.1;
  const cp2y = midY + dx * 0.1;


  // Use 'Q' for quadratic Bezier (one control point) or 'C' for cubic (two control points)
  // Simple quadratic curve for zig-zag, control point roughly in middle and offset
  const controlX = (x1 + x2) / 2 + (y2 > y1 ? (x1 < x2 ? 30 : -30) : (x1 < x2 ? -30 : 30)); // Simple offset for curve
  const controlY = (y1 + y2) / 2;
  
  // Straight line is simpler and often cleaner for roadmaps.
  // const d = `M${x1},${y1} L${x2},${y2}`; 
  // Quadratic Bezier curve for a slight arc
  const d = `M${x1},${y1} Q${controlX},${controlY} ${x2},${y2}`;


  return (
    <path
      d={d}
      className={cn(
        statusColors[status],
        'transition-all duration-300',
        isBold ? 'stroke-[4px]' : 'stroke-[2px]'
      )}
      fill="none"
    />
  );
};

export default RoadmapLine;
