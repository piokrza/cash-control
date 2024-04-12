import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { APP_SERVICE_CONFIG } from '@ngpk/email/config';
import { EmailSummary, Email, AppConfig } from '@ngpk/email/model';

@Injectable()
export class InboxApi {
  constructor(
    @Inject(APP_SERVICE_CONFIG) private readonly appConfig: AppConfig,
    private readonly http: HttpClient
  ) {}

  loadEmails$(): Observable<EmailSummary[]> {
    return this.http.get<EmailSummary[]>(`${this.appConfig.BASE_URL}/emails`);
  }

  loadEmailById$(id: string): Observable<Email> {
    return this.http.get<Email>(`${this.appConfig.BASE_URL}/emails/${id}`);
  }

  sendEmail(email: Email): Observable<any> {
    return this.http.post(`${this.appConfig.BASE_URL}/emails`, email);
  }
}
