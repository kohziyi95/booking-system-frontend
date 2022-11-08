import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.css'],
})
export class CreditsComponent implements OnInit {
  constructor(private fb: FormBuilder) {}

  paymentForm!: FormGroup;

  ngOnInit(): void {
    this.paymentForm = this.createForm();
  }

  createForm() {
    return this.fb.group({
      credits: this.fb.control('$100', [
        Validators.required,
        Validators.min(1),
        Validators.max(1000),
      ]),
    });
  }
  stripePromise = loadStripe(
    'pk_test_51M0gaEKdPlDwwpBGX8h4UfAdrov4Aepw7OIAXf0L9QlWRuFzGk0wOJHUI4CmmjxE9iabbA69PSJk47lsDIoNVWr700ktH1Pbx8'
  );

  priceIds = {
    $100: 'price_1M0mjyKdPlDwwpBGq1UCzhd7',
    $50: 'price_1M0mmLKdPlDwwpBG6h9eLum6',
    $300: 'price_1M0mmVKdPlDwwpBGrkClXTCn',
  };

  // items!: number[];

  async checkout() {
    // const items = this.items;
    // const response = await fetch("/create-payment-intent", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ items }),
    // });
    // const { clientSecret } = await response.json();

    // const appearance = {
    //   theme: 'stripe',
    // };
    // elements = stripe.elements({ appearance, clientSecret });

    // const paymentElement = elements.create("payment");
    // paymentElement.mount("#payment-element");
    const stripe = await this.stripePromise;
    let priceId!: string;
    switch (this.paymentForm.get('credits')?.value) {
      case '$50':
        priceId = this.priceIds.$100;
        break;
      case '$100':
        priceId = this.priceIds.$100;
        break;
      case '$300':
        priceId = this.priceIds.$100;
        break;
      default:
        priceId = "N/A";
        break;
    }

    console.log("Price ID: ", priceId);

    if (stripe != null) {
      const { error } = await stripe.redirectToCheckout({
        mode: 'payment',
        lineItems: [{ price: priceId, quantity:1 }],
        successUrl: `${window.location.href}/success`,
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
