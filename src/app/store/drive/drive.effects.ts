import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { catchError, exhaustMap, from, map, of, takeUntil, tap } from 'rxjs';

import { ToastStatus } from '#common/enums';
import { DbSubscriptionService, ToastService } from '#common/services';
import { IFile } from '#drive/models';
import { DriveApiService } from '#drive/services';
import { DriveActions } from '#store/drive';

@Injectable()
export class DriveEffects {
  private readonly actions$: Actions = inject(Actions);
  private readonly toastService: ToastService = inject(ToastService);
  private readonly translate: TranslateService = inject(TranslateService);
  private readonly driveApiService: DriveApiService = inject(DriveApiService);
  private readonly dbSubscriptionService: DbSubscriptionService = inject(DbSubscriptionService);

  public loadFiles$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DriveActions.getFiles),
      exhaustMap(({ uid }) => {
        return this.driveApiService.loadFiles$(uid).pipe(
          map((files: IFile[]) => DriveActions.getFilesSuccess({ files })),
          takeUntil(this.dbSubscriptionService.unsubscribe$),
          catchError(() => {
            return of(DriveActions.getFilesFailure());
          })
        );
      })
    );
  });

  public uploadFile$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DriveActions.uploadFile),
      exhaustMap(({ payload }) => {
        return from(this.driveApiService.uploadFile(payload)).pipe(
          tap(() => this.toastService.showMessage(ToastStatus.SUCCESS, this.tr('success'), this.tr('addFileSuccess'))),
          map(() => DriveActions.uploadFileSuccess()),
          catchError(() => {
            this.toastService.showMessage(ToastStatus.SUCCESS, this.tr('error'), this.tr('addFileError'));
            return of(DriveActions.uploadFileFailure());
          })
        );
      })
    );
  });

  public uploadFolder$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DriveActions.uploadFolder),
      exhaustMap(({ payload }) => {
        return from(this.driveApiService.uploadFolder(payload)).pipe(
          tap(() => this.toastService.showMessage(ToastStatus.SUCCESS, this.tr('success'), this.tr('addFolderSuccess'))),
          map(() => DriveActions.uploadFolderSuccess()),
          catchError(() => {
            this.toastService.showMessage(ToastStatus.SUCCESS, this.tr('error'), this.tr('addFolderError'));
            return of(DriveActions.uploadFolderFailure());
          })
        );
      })
    );
  });

  private tr(path: string): string {
    return this.translate.instant('toastMessage.' + path);
  }
}
