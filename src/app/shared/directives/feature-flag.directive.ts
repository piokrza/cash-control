import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { environment } from 'src/environments/environment';

import { Feature } from '#core/models';

@Directive({ selector: '[featureEnabled]', standalone: true })
export class FeatureFlagDirective {
  readonly #viewContainerRef = inject(ViewContainerRef);
  readonly #templateRef: TemplateRef<unknown> = inject(TemplateRef<unknown>);

  @Input({ required: true }) set featureEnabled(featureName: Feature) {
    if (environment.featureFlags[featureName]) {
      this.#viewContainerRef.createEmbeddedView(this.#templateRef);
    } else {
      this.#viewContainerRef.clear();
    }
  }
}
