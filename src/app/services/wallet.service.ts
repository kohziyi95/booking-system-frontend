import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';


const TRANSACTION_API = "/api/transaction/"

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  constructor(private http: HttpClient) {}

  public getCredits(userId: number) {
    return firstValueFrom(this.http.get(`${TRANSACTION_API}credits/${userId}`));
  }

  public postTopUpTransaction(userId: number, amount: number) {
    return firstValueFrom(
      this.http
        .post(`${TRANSACTION_API}topup`, { userId: userId, amount: amount })
        .pipe()
    );
  }

  public postBookingTransaction(userId: number, amount: number, bookingId: string) {
    return firstValueFrom(
      this.http
        .post(`${TRANSACTION_API}book`, { userId: userId, amount: amount, bookingId: bookingId })
        .pipe()
    );
  }
}

