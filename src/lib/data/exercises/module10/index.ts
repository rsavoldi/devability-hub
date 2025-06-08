
import type { Exercise } from '@/lib/types';
import { module10MultipleChoiceExercises } from './multipleChoice';
import { module10FillInTheBlankExercises } from './fillInTheBlank';
import { module10AssociationExercises } from './association';
import { module10OrderingExercises } from './ordering';
import { module10DragAndDropExercises } from './dragAndDrop';

export const module10Exercises: Exercise[] = [
  ...module10MultipleChoiceExercises,
  ...module10FillInTheBlankExercises,
  ...module10AssociationExercises,
  ...module10OrderingExercises,
  ...module10DragAndDropExercises,
];
