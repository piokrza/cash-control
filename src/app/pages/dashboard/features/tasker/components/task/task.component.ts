import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { PrimeIcons } from 'primeng/api';

import { TaskService } from '#tasker/data-access';
import { Task, TaskStep, ToggleIsStepCompletePayload } from '#tasker/models';

@Component({
  selector: 'ctrl-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskComponent implements OnChanges {
  private readonly taskService: TaskService = inject(TaskService);

  @Input({ required: true }) task!: Task;

  @Output() removeTask = new EventEmitter<string>();
  @Output() toggleIsTaskComplete = new EventEmitter<string>();
  @Output() toggleIsStepComplete = new EventEmitter<ToggleIsStepCompletePayload>();

  public completedSteps!: number;
  public isStepsVisible!: boolean;
  public isTaskComplete!: boolean;
  public readonly PrimeIcons: typeof PrimeIcons = PrimeIcons;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['task']) {
      this.isTaskComplete = this.task.isComplete;
      this.completedSteps = this.task.steps.filter(({ isComplete }: TaskStep) => isComplete).length;
      this.isStepsVisible = this.taskService.getIsVisible(this.task.id);
    }
  }

  public toggleStepsVisibility(): void {
    this.isStepsVisible = !this.isStepsVisible;
    this.taskService.setIsVisibleData(this.task.id, this.isStepsVisible);
  }
}
