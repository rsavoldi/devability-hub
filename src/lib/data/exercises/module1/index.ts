
import type { Exercise } from '@/lib/types';
import { module1MultipleChoiceExercises } from './multipleChoice';
import { module1FillInTheBlankExercises } from './fillInTheBlank';
import { module1AssociationExercises } from './association';
import { module1OrderingExercises } from './ordering';
import { module1DragAndDropExercises } from './dragAndDrop';

export const module1Exercises: Exercise[] = [
  ...module1MultipleChoiceExercises,
  ...module1FillInTheBlankExercises,
  ...module1AssociationExercises,
  ...module1OrderingExercises,
  ...module1DragAndDropExercises,
];
