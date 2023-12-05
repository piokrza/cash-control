import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslateLoader, TranslateService } from '@ngx-translate/core';
import { Observable, forkJoin, map } from 'rxjs';

import { Language } from '#common/models';

export const LANG = 'lang';

export function initializeTranslations(translateService: TranslateService) {
  const languages: Array<Language['value']> = ['pl', 'en'];

  return () => {
    translateService.addLangs(languages);
    translateService.setDefaultLang('pl');

    return translateService.use(localStorage.getItem(LANG) ?? 'pl');
  };
}

export class CustomTranslateHttpLoader implements TranslateLoader {
  private readonly http: HttpClient = inject(HttpClient);

  public getTranslation(lang: string): Observable<object> {
    const requests = [
      `/assets/i18n/${lang}/auth.json`,
      `/assets/i18n/${lang}/common.json`,
      `/assets/i18n/${lang}/dashboard.json`,
      `/assets/i18n/${lang}/web3.json`,
    ].map((url: string) => this.http.get<object>(url));

    return forkJoin(requests).pipe(map((responses: object[]) => Object.assign({}, ...responses)));
  }
}
