
"use client";

import React from 'react';
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PathProgress } from '@/types';

interface RoadmapNodeProps {
  id: string;
  x: number;
  y: number;
  radius?: number;
  title: string;
  iconName?: string; // Lucide icon name
  path: string;
  status: 'completed' | 'in-progress' | 'not-started';
  progressPercent?: number; // 0-100 for in-progress
  isCurrent?: boolean; // For the moving avatar
  onClick?: () => void;
}

const RoadmapNode: React.FC<RoadmapNodeProps> = ({
  id,
  x,
  y,
  radius = 30,
  title,
  iconName,
  path,
  status,
  progressPercent = 0,
  isCurrent = false,
  onClick
}) => {
  const IconComponent = iconName ? (LucideIcons[iconName as keyof typeof LucideIcons] as React.FC<React.SVGProps<SVGSVGElement>>) : LucideIcons.BookMarked;
  
  const statusColors = {
    completed: 'fill-green-500 stroke-green-700',
    'in-progress': 'fill-yellow-400 stroke-yellow-600',
    'not-started': 'fill-muted stroke-border',
  };

  const textColors = {
    completed: 'fill-green-50',
    'in-progress': 'fill-yellow-900',
    'not-started': 'fill-foreground',
  };

  const iconColors = {
    completed: 'text-green-50',
    'in-progress': 'text-yellow-900',
    'not-started': 'text-foreground',
  };

  const outerRadius = radius * 1.1; // For hover effect

  // Split title into lines if too long
  const MAX_CHARS_PER_LINE = 15;
  const words = title.split(' ');
  const lines = [];
  let currentLine = '';
  for (const word of words) {
    if ((currentLine + word).length > MAX_CHARS_PER_LINE && currentLine.length > 0) {
      lines.push(currentLine.trim());
      currentLine = word + ' ';
    } else {
      currentLine += word + ' ';
    }
  }
  lines.push(currentLine.trim());


  return (
    <Link href={path} passHref legacyBehavior>
      <g
        transform={`translate(${x}, ${y})`}
        className="cursor-pointer group roadmap-node"
        onClick={onClick}
        aria-label={title}
      >
        {/* Shadow/Highlight for hover */}
        <circle
            cx="0"
            cy="0"
            r={outerRadius}
            className="opacity-0 group-hover:opacity-30 transition-opacity duration-200"
            fill="hsl(var(--accent))"
        />
        <circle
          cx="0"
          cy="0"
          r={radius}
          className={cn(statusColors[status], 'transition-all duration-300 group-hover:brightness-110')}
          strokeWidth="2"
        />
        {status === 'in-progress' && progressPercent > 0 && (
          <circle
            cx="0"
            cy="0"
            r={radius}
            fill="transparent"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            strokeDasharray={`${(progressPercent / 100) * 2 * Math.PI * radius} ${2 * Math.PI * radius}`}
            transform="rotate(-90)"
            className="transition-all duration-500"
          />
        )}
        <IconComponent
          x={-radius / 2.5}
          y={-radius / 1.5 } // Adjust icon position based on text lines
          width={radius / 1.2}
          height={radius / 1.2}
          className={cn(iconColors[status], 'pointer-events-none')}
        />
        {/* Render text lines */}
        {lines.map((line, index) => (
            <text
                key={index}
                x="0"
                y={ radius * 0.2 + (index * (radius * 0.35)) } // Adjust y for multiple lines
                textAnchor="middle"
                fontSize={radius * 0.25}
                className={cn(textColors[status], 'font-semibold pointer-events-none select-none')}
                
            >
                {line}
            </text>
        ))}

        {isCurrent && (
            <text x="0" y={radius + 20} fontSize="24" textAnchor="middle">🚀</text>
        )}
      </g>
    </Link>
  );
};

export default RoadmapNode;
