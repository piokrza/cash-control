import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Observable, first } from 'rxjs';

import { PrimeIcons } from 'primeng/api';
import { SelectButtonChangeEvent } from 'primeng/selectbutton';
import { TabViewChangeEvent } from 'primeng/tabview';
import { ToggleButtonChangeEvent } from 'primeng/togglebutton';

import { LabeledData } from '#core/models';
import { NotesData, Task, TaskFilter, TasksData, ToggleIsStepCompletePayload } from '#tasker/models';
import { TaskerFacadeService } from '#tasker/services';

@Component({
  selector: 'org-tasker',
  templateUrl: './tasker.component.html',
  styleUrl: './tasker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskerComponent {
  private readonly taskerFacadeService = inject(TaskerFacadeService);

  readonly tasksData$: Observable<TasksData> = this.taskerFacadeService.tasksData$;
  readonly isTasksLoading$: Observable<boolean> = this.taskerFacadeService.isTasksLoading$;
  readonly notesData$: Observable<NotesData> = this.taskerFacadeService.notesData$;
  readonly isNotesLoading$: Observable<boolean> = this.taskerFacadeService.isNotesLoading$;

  readonly activeTabIndex$: Observable<number> = this.taskerFacadeService.activeTabIndex$;

  readonly PrimeIcons: typeof PrimeIcons = PrimeIcons;
  readonly filters: Array<LabeledData<TaskFilter>> = this.taskerFacadeService.taskFilters;

  public addTask(): void {
    this.taskerFacadeService.addTask$().pipe(first()).subscribe();
  }

  public editTask(task: Task): void {
    this.taskerFacadeService.editTask$(task).pipe(first()).subscribe();
  }

  public removeTask(taskId: string): void {
    this.taskerFacadeService.removeTask(taskId);
  }

  public toggleIsTaskComplete(taskId: string): void {
    this.taskerFacadeService.toggleIsTaskComplete(taskId);
  }

  public toggleIsStepComplete(payload: ToggleIsStepCompletePayload): void {
    this.taskerFacadeService.toggleIsStepComplete(payload);
  }

  public taskFilterChange({ value }: SelectButtonChangeEvent) {
    this.taskerFacadeService.onTaskFilterChange(value);
  }

  public noteFilterChange({ checked }: ToggleButtonChangeEvent): void {
    this.taskerFacadeService.onNoteFilterChange(checked ? 'newest' : 'oldest');
  }

  public addNote(): void {
    this.taskerFacadeService.addNote$().pipe(first()).subscribe();
  }

  public removeNote(noteId: string): void {
    this.taskerFacadeService.removeNote(noteId);
  }

  public onTabviewChange({ index }: TabViewChangeEvent): void {
    this.taskerFacadeService.setActiveTabIdx(index);
  }
}
