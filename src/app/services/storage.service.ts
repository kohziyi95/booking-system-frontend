import { Injectable } from '@angular/core';

const USER_KEY = 'auth-user';
const TRANSACTION_KEY = 'transaction-id';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  clean(): void {
    window.sessionStorage.clear();
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }

  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }

    return false;
  }

  public resetTransactions() {
    window.sessionStorage.removeItem(TRANSACTION_KEY);
  }

  public addTransactions(transactionId: string) {
    window.sessionStorage.setItem(TRANSACTION_KEY, transactionId);
  }

  public transactionExists(): boolean {
    const transaction = window.sessionStorage.getItem(TRANSACTION_KEY);
    if (transaction) {
      return true;
    }
    return false;
  }
}
