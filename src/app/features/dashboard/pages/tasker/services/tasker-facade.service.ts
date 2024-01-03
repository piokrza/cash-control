import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, combineLatest, map, tap } from 'rxjs';

import { ConfirmationService, PrimeIcons } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { BaseDialogStyles } from '#common/constants';
import { LabeledData } from '#common/models';
import { TaskerActions, TaskerSelectors } from '#store/tasker';
import { NoteFormComponent, TaskFormComponent } from '#tasker/components';
import { Note, NoteFilter, NotesData, Task, TaskFilter, TasksData, ToggleIsStepCompletePayload } from '#tasker/models';
import { TaskerService } from '#tasker/services';

@Injectable()
export class TaskerFacadeService {
  readonly #store: Store = inject(Store);
  readonly #taskerService: TaskerService = inject(TaskerService);
  readonly #dialogService: DialogService = inject(DialogService);
  readonly #translateService: TranslateService = inject(TranslateService);
  readonly #confirmationService: ConfirmationService = inject(ConfirmationService);

  public get tasksData$(): Observable<TasksData> {
    return combineLatest({
      tasks: this.#store.select(TaskerSelectors.tasks),
      filter: this.#store.select(TaskerSelectors.taskFilter),
    }).pipe(map((tasksData) => this.filterTasks(tasksData)));
  }

  public get isTasksLoading$(): Observable<boolean> {
    return this.#store.select(TaskerSelectors.isTasksLoading);
  }

  public get taskFilters(): LabeledData<TaskFilter>[] {
    return this.#taskerService.taskFilters;
  }

  public get activeTabIndex$(): Observable<number> {
    return this.#taskerService.activeTabIndex$;
  }

  public get notesData$(): Observable<NotesData> {
    return combineLatest({
      notes: this.#store.select(TaskerSelectors.notes),
      filter: this.#store.select(TaskerSelectors.noteFilter),
    }).pipe(
      map(({ notes, filter }) => ({
        notes: this.sortNotes(notes, filter),
        filter: filter === 'newest' ? true : false,
      }))
    );
  }

  public get isNotesLoading$(): Observable<boolean> {
    return this.#store.select(TaskerSelectors.isNotesLoading);
  }

  public addTask$(): Observable<Task | undefined> {
    const dialogRef: DynamicDialogRef = this.#dialogService.open(TaskFormComponent, {
      header: this.tr('addTask'),
      style: BaseDialogStyles,
    });

    return dialogRef.onClose.pipe(
      tap((task?: Task) => {
        task && this.#store.dispatch(TaskerActions.addTask({ task }));
      })
    );
  }

  public editTask$(task: Task): Observable<Task | undefined> {
    const dialogRef: DynamicDialogRef = this.#dialogService.open(TaskFormComponent, {
      header: `${this.tr('editTask')}: ${task.name}`,
      style: BaseDialogStyles,
      data: task,
    });

    return dialogRef.onClose.pipe(
      tap((editedTask?: Task) => {
        editedTask && this.#store.dispatch(TaskerActions.editTask({ editedTask }));
      })
    );
  }

  public removeTask(taskId: string): void {
    this.#confirmationService.confirm({
      message: this.tr('removeMessage'),
      header: this.tr('removeHeader'),
      icon: PrimeIcons.TRASH,
      accept: (): void => this.#store.dispatch(TaskerActions.removeTask({ taskId })),
    });
  }

  public toggleIsTaskComplete(taskId: string): void {
    this.#store.dispatch(TaskerActions.toggleIsTaskComplete({ taskId }));
  }

  public toggleIsStepComplete(payload: ToggleIsStepCompletePayload) {
    this.#store.dispatch(TaskerActions.toggleIsStepComplete({ payload }));
  }

  public onTaskFilterChange(taskFilter: TaskFilter): void {
    this.#store.dispatch(TaskerActions.setTaskFilter({ taskFilter }));
  }

  public addNote$(): Observable<Note | undefined> {
    const dialogRef = this.#dialogService.open(NoteFormComponent, {
      header: this.tr('addNote'),
      style: BaseDialogStyles,
    });

    return dialogRef.onClose.pipe(
      tap((note?: Note) => {
        note && this.#store.dispatch(TaskerActions.addNote({ note }));
      })
    );
  }

  public removeNote(noteId: string): void {
    this.#confirmationService.confirm({
      message: this.tr('removeNoteMessage'),
      header: this.tr('removeNoteHeader'),
      icon: PrimeIcons.TRASH,
      accept: (): void => this.#store.dispatch(TaskerActions.removeNote({ noteId })),
    });
  }

  public onNoteFilterChange(noteFilter: NoteFilter): void {
    this.#store.dispatch(TaskerActions.setNoteFilter({ noteFilter }));
  }

  public setActiveTabIdx(idx: number): void {
    this.#taskerService.setActiveTabIndex(idx);
  }

  private tr(path: string): string {
    return this.#translateService.instant(`tasker.${path}`);
  }

  private filterTasks({ tasks, filter }: TasksData) {
    if (filter === 'all') {
      return { tasks, filter };
    } else {
      return {
        tasks: tasks.filter(({ isComplete }) => (filter === 'completed' ? isComplete : !isComplete)),
        filter,
      };
    }
  }

  private sortNotes(notes: Note[], filter: NoteFilter): Note[] {
    const clonedNotes: Note[] = [...(notes ?? [])];

    return clonedNotes.sort((a, b) => {
      const dateA = a.createDate.toDate().getTime();
      const dateB = b.createDate.toDate().getTime();
      return filter === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }
}
