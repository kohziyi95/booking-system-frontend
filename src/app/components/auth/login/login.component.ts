import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.formGroup = this.createForm();
  }

  formGroup!: FormGroup;

  createForm(): FormGroup {
    return this.fb.group({
      username: this.fb.control<string>('', [
        Validators.minLength(3),
        Validators.required,
      ]),
      email: this.fb.control<string>('', [
        Validators.email,
        Validators.required,
      ]),
      password: this.fb.control<string>('', [
        Validators.minLength(8),
        Validators.required,
      ]),
    });
  }

  isSuccessful = false;
  signUpFailed = false;
  errorMessage = '';

  processLogin() {
    console.info('Logging in >>>>>>>>>', this.formGroup.value);
    this.formGroup = this.createForm();
  }
}
