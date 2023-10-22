import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ctrl-layout',
  template: `
    <div class="wrapper">
      <ctrl-navigation />

      <ctrl-container>
        <main>
          <ng-content />
        </main>
      </ctrl-container>
    </div>

    <p-toast position="top-right" />
    <p-confirmDialog />
  `,
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {}
