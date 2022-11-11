import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  constructor(private http: HttpClient) {}

  public getCredits(userId: number) {
    return firstValueFrom(this.http.get(`/api/transaction/credits/${userId}`));
  }

  public postTopUpTransaction(userId: number, amount: number) {
    return firstValueFrom(
      this.http
        .post('/api/transaction/topup', { userId: userId, amount: amount })
        .pipe()
    );
  }

  public postBookingTransaction(userId: number, amount: number, bookingId: string) {
    return firstValueFrom(
      this.http
        .post('/api/transaction/book', { userId: userId, amount: amount, bookingId: bookingId })
        .pipe()
    );
  }
}

