import { StorageService } from 'src/app/services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, HostListener, OnInit } from '@angular/core';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css'],
})
export class SuccessComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService,
    private walletService: WalletService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.topUpAmount = this.activatedRoute.snapshot.params['amount'];
    console.log('Top up amount: $', this.topUpAmount);
    if (this.storageService.transactionExists()){
      this.transactionExists = true;
    } else {
      this.addToWallet(this.topUpAmount);
    }
  }
  topUpAmount!: number;
  transactionExists: boolean = false;
  successfulTransaction: boolean = false;
  newBalance!: number;
  transactionId!: string;
  errorMessage!: string;
  currentUser = this.storageService.getUser();

  addToWallet(amount: number) {
    const userId = this.currentUser.id;
    this.walletService
      .postTopUpTransaction(userId, amount)
      .then((data) => {
        console.log(data);
        if (Object(data)['statusCode'] == 200) {
          this.successfulTransaction = true;
          this.newBalance = Object(data)['newCredit'];
          this.transactionId = Object(data)['transactionId'];
          this.storageService.addTransactions(this.transactionId);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
