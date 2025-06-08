
"use client";

import React, { useState, useEffect } from 'react';
import RoadmapNode from './RoadmapNode';
import RoadmapLine from './RoadmapLine';
import type { LearningPath, Lesson, Language, PathProgress } from '@/types';
import { useProgress } from '@/contexts/ProgressContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Rocket } from 'lucide-react';

interface InteractiveRoadmapProps {
  items: (LearningPath | Lesson)[];
  basePath: string; // e.g., "/learning-paths" or "/learning-paths/[pathId]"
  isMainRoadmap: boolean; // True if displaying LearningPath, false for Lessons
  currentPathId?: string; // Only for lesson roadmap, to know parent path
}

const InteractiveRoadmap: React.FC<InteractiveRoadmapProps> = ({ items, basePath, isMainRoadmap, currentPathId }) => {
  const { language } = useLanguage();
  const { getPathProgress, isPathCompleted, isLessonCompleted, isLoading: progressLoading, progress } = useProgress();
  const [svgDimensions, setSvgDimensions] = useState({ width: 800, height: items.length * 150 + 100 });

  useEffect(() => {
    const calculateHeight = () => items.length * 150 + 100;
    const calculateWidth = () => {
        if (typeof window !== 'undefined') {
            return Math.min(window.innerWidth * 0.9, 800); // Responsive width
        }
        return 800;
    }
    
    setSvgDimensions({ width: calculateWidth(), height: calculateHeight() });

    if (typeof window !== 'undefined') {
        const handleResize = () => {
            setSvgDimensions({ width: calculateWidth(), height: calculateHeight() });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }
  }, [items.length]);

  if (progressLoading) {
    return (
      <div className="w-full flex flex-col items-center p-8 space-y-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className={`flex w-full ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
            <Skeleton className="h-24 w-24 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  const nodeRadius = svgDimensions.width < 500 ? 35 : 45;
  const verticalSpacing = nodeRadius * 3.5;
  const horizontalOffset = svgDimensions.width / 4; // How much to zig-zag

  const nodes = items.map((item, index) => {
    const x = index % 2 === 0 ? svgDimensions.width / 2 - horizontalOffset : svgDimensions.width / 2 + horizontalOffset;
    const y = verticalSpacing * (index + 0.5) + nodeRadius; // Added 0.5 for padding top
    
    let status: 'completed' | 'in-progress' | 'not-started' = 'not-started';
    let progressPercent = 0;
    let pathProgress: PathProgress | undefined;

    if (isMainRoadmap) { // LearningPath
        pathProgress = getPathProgress(item.id);
        if (pathProgress?.completed) {
            status = 'completed';
            progressPercent = 100;
        } else if (pathProgress && pathProgress.points > 0) {
            status = 'in-progress';
            const totalLessons = (item as LearningPath).lessons.length;
            const completedLessons = Object.values(pathProgress.lessons).filter(l => l.completed).length;
            progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
        }
    } else if (currentPathId) { // Lesson
        const lessonIsCompleted = isLessonCompleted(currentPathId, item.id);
        if (lessonIsCompleted) {
            status = 'completed';
            progressPercent = 100;
        } else {
            // Check if it's the current lesson for "in-progress" status
            pathProgress = getPathProgress(currentPathId);
            const parentPath = progress.paths[currentPathId];
            const lessonIndex = (items as Lesson[]).findIndex(l => l.id === item.id);
            if (parentPath && lessonIndex === parentPath.currentLessonIndex) {
                 status = 'in-progress';
            } else {
                 status = 'not-started';
            }
        }
    }
    
    return {
      ...item,
      x,
      y,
      nodePath: `${basePath}/${item.id}`,
      status,
      progressPercent,
      iconName: item.icon || (isMainRoadmap ? 'BookMarked' : 'FileText'),
    };
  });

  // Calculate avatar position
  let avatarPos = { x: nodes[0]?.x ?? 0, y: nodes[0]?.y ?? 0 - nodeRadius - 10}; // Default to first node or slightly above
  let lastCompletedIndex = -1;

  if (isMainRoadmap) {
      for (let i = nodes.length - 1; i >= 0; i--) {
          if (nodes[i].status === 'completed') {
              lastCompletedIndex = i;
              break;
          }
      }
      if (lastCompletedIndex === -1) { // No paths completed, check for in-progress
        const firstInProgressIndex = nodes.findIndex(node => node.status === 'in-progress');
        if (firstInProgressIndex !== -1) {
          avatarPos = { x: nodes[firstInProgressIndex].x, y: nodes[firstInProgressIndex].y - nodeRadius - 10};
        }
      } else if (lastCompletedIndex < nodes.length -1) { // Last completed is not the final path
        avatarPos = { x: nodes[lastCompletedIndex + 1].x, y: nodes[lastCompletedIndex + 1].y - nodeRadius - 10};
      } else { // All paths completed
        avatarPos = { x: nodes[lastCompletedIndex].x, y: nodes[lastCompletedIndex].y + nodeRadius + 10};
      }
  } else if (currentPathId) {
    const parentPathProg = getPathProgress(currentPathId);
    if (parentPathProg) {
      const currentLessonIdx = parentPathProg.currentLessonIndex;
      if (currentLessonIdx < nodes.length && currentLessonIdx >=0) {
        avatarPos = { x: nodes[currentLessonIdx].x, y: nodes[currentLessonIdx].y - nodeRadius - 10 };
      } else if (currentLessonIdx >= nodes.length && nodes.length > 0) { // All lessons done in this path
        avatarPos = { x: nodes[nodes.length -1].x, y: nodes[nodes.length -1].y + nodeRadius + 10 };
      }
    }
  }


  return (
    <div className="flex justify-center w-full overflow-x-auto">
      <svg width={svgDimensions.width} height={svgDimensions.height} aria-labelledby="roadmap-title">
        <title id="roadmap-title">{isMainRoadmap ? "Learning Paths Roadmap" : "Module Roadmap"}</title>
        {/* Lines */}
        {nodes.slice(0, -1).map((node, index) => {
          const nextNode = nodes[index + 1];
          let lineStatus = node.status;
          if(node.status === 'completed' && nextNode.status !== 'completed') lineStatus = 'in-progress';
          if(node.status === 'not-started') lineStatus = 'not-started';

          return (
            <RoadmapLine
              key={`line-${node.id}`}
              x1={node.x}
              y1={node.y}
              x2={nextNode.x}
              y2={nextNode.y}
              status={lineStatus}
              isBold={node.status === 'completed' && nextNode.status === 'in-progress'}
            />
          );
        })}
        {/* Nodes */}
        {nodes.map(node => (
          <RoadmapNode
            key={node.id}
            id={node.id}
            x={node.x}
            y={node.y}
            radius={nodeRadius}
            title={node.title[language]}
            iconName={node.iconName}
            path={node.nodePath}
            status={node.status}
            progressPercent={node.progressPercent}
          />
        ))}
        {/* Moving Avatar */}
        {nodes.length > 0 && (
             <Rocket 
                x={avatarPos.x - 12} // Adjust to center the icon
                y={avatarPos.y - 12}
                className="w-6 h-6 text-primary animate-bounce" 
                aria-label="Current progress"
            />
        )}
      </svg>
    </div>
  );
};

export default InteractiveRoadmap;
