
import type { Exercise } from '@/lib/types';
import { module3MultipleChoiceExercises } from './multipleChoice';
import { module3FillInTheBlankExercises } from './fillInTheBlank';
import { module3AssociationExercises } from './association';
import { module3OrderingExercises } from './ordering';
import { module3DragAndDropExercises } from './dragAndDrop';

export const module3Exercises: Exercise[] = [
  ...module3MultipleChoiceExercises,
  ...module3FillInTheBlankExercises,
  ...module3AssociationExercises,
  ...module3OrderingExercises,
  ...module3DragAndDropExercises,
];
