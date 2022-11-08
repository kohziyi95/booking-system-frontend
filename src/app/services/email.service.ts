import { EmailDetails } from './../models';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor(private http: HttpClient) {}

  public sendConfirmationEmail(emailDetails: EmailDetails) {
    return firstValueFrom(
      this.http.post(`/api/mail/sendMail`, emailDetails, {
        responseType: 'text',
      })
    );
  }
}
