import { Timestamp } from '@angular/fire/firestore';

export interface Task {
  name: string;
  isComplete: boolean;
  createDate?: Timestamp;
  id: string;
}

export interface TaskWithSteps extends Task {
  steps: Task[];
}
