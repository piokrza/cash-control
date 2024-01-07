import { inject, Injectable, NgZone } from '@angular/core';

import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly #messageService = inject(MessageService);
  readonly #ngZone = inject(NgZone);

  readonly #duration = 5000;

  public showMessage(severity: string, summary: string, detail: string): void {
    this.#ngZone.run((): void => {
      this.#messageService.clear();
      this.#messageService.add({ severity, summary, detail, life: this.#duration });

      setTimeout((): void => this.#messageService.clear(), this.#duration);
    });
  }
}
