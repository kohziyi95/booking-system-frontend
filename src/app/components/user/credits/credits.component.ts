import { Router } from '@angular/router';
import { WalletService } from './../../../services/wallet.service';
import { StorageService } from './../../../services/storage.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.css'],
})
export class CreditsComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private storageService: StorageService,
    private walletService: WalletService,
    private router:Router
  ) {}

  paymentForm!: FormGroup;

  ngOnInit(): void {
    this.paymentForm = this.createForm();
    // const stripe   = Stripe('pk_test_51M0gaEKdPlDwwpBGX8h4UfAdrov4Aepw7OIAXf0L9QlWRuFzGk0wOJHUI4CmmjxE9iabbA69PSJk47lsDIoNVWr700ktH1Pbx8');
    // const elements = stripe.elements();
    this.invokeStripe();
    this.getCurrentCredits();
    
  }

  createForm() {
    return this.fb.group({
      credits: this.fb.control('100', [
        Validators.required,
        Validators.min(1),
        Validators.max(1000),
      ]),
    });
  }
  stripePromise = loadStripe(
    'pk_test_51M0gaEKdPlDwwpBGX8h4UfAdrov4Aepw7OIAXf0L9QlWRuFzGk0wOJHUI4CmmjxE9iabbA69PSJk47lsDIoNVWr700ktH1Pbx8'
  );

  paymentHandler: any = null;

  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51M0gaEKdPlDwwpBGX8h4UfAdrov4Aepw7OIAXf0L9QlWRuFzGk0wOJHUI4CmmjxE9iabbA69PSJk47lsDIoNVWr700ktH1Pbx8',
          locale: 'auto',
          token: function (stripeToken: any) {
            console.log(stripeToken);
            alert('Payment has been successfull!');
          },
        });
      };
      window.document.body.appendChild(script);
    }
  }

  priceIds = {
    $100: 'price_1M0mjyKdPlDwwpBGq1UCzhd7',
    $50: 'price_1M0mmLKdPlDwwpBG6h9eLum6',
    $300: 'price_1M0mmVKdPlDwwpBGrkClXTCn',
  };


  currentCredits !: number;

  getCurrentCredits() {
    const userId = this.storageService.getUser().id;
    this.walletService.getCredits(userId).then((data) => {
      console.log("Credits retrieved: ", data);
      this.currentCredits = Object(data)["credits"];
    });
  }

  async checkout() {
    const stripe = await this.stripePromise;
    let priceId!: string;
    switch (this.paymentForm.get('credits')?.value) {
      case '50':
        priceId = this.priceIds.$50;
        break;
      case '100':
        priceId = this.priceIds.$100;
        break;
      case '300':
        priceId = this.priceIds.$300;
        break;
      default:
        priceId = 'N/A';
        break;
    }

    // console.log("Price ID: ", priceId);

    if (stripe != null) {
      const { error } = await stripe.redirectToCheckout({
        mode: 'payment',
        lineItems: [{ price: priceId, quantity: 1 }],
        successUrl: `${window.location.href}/success/${
          this.paymentForm.get('credits')?.value
        }`,
        cancelUrl: `${window.location.href}/failure`,
      });
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `error.message`.
      if (error) {
        console.log(error);
      }
    }
  }

  
}
