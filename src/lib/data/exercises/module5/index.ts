
import type { Exercise } from '@/lib/types';
import { module5MultipleChoiceExercises } from './multipleChoice';
import { module5FillInTheBlankExercises } from './fillInTheBlank';
import { module5AssociationExercises } from './association';
import { module5OrderingExercises } from './ordering';
import { module5DragAndDropExercises } from './dragAndDrop';

export const module5Exercises: Exercise[] = [
  ...module5MultipleChoiceExercises,
  ...module5FillInTheBlankExercises,
  ...module5AssociationExercises,
  ...module5OrderingExercises,
  ...module5DragAndDropExercises,
];
