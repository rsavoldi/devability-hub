
import type { Exercise } from '@/lib/types';
import { module11MultipleChoiceExercises } from './multipleChoice';
import { module11FillInTheBlankExercises } from './fillInTheBlank';
import { module11AssociationExercises } from './association';
import { module11OrderingExercises } from './ordering';
import { module11DragAndDropExercises } from './dragAndDrop';

export const module11Exercises: Exercise[] = [
  ...module11MultipleChoiceExercises,
  ...module11FillInTheBlankExercises,
  ...module11AssociationExercises,
  ...module11OrderingExercises,
  ...module11DragAndDropExercises,
];
