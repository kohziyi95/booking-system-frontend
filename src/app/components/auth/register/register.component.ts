import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

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
      confirmPassword: this.fb.control<string>('', [
        Validators.minLength(8),
        Validators.required,
      ]),
    });
  }

  passwordInvalid() {
    return (this.formGroup.get('password')?.value != this.formGroup.get('confirmPassword')?.value)
  }

  isSuccessful = false;
  signUpFailed = false;
  errorMessage = '';


  processSignUp(){
    console.info("Registering >>>>>>>>>", this.formGroup.value);
    if (this.passwordInvalid()){
      this.errorMessage = "Passwords do not match.";
      console.error(this.errorMessage);
      this.signUpFailed = true;
    } else {
      const { username, email, password} = this.formGroup.value;
      this.authService.register(username, email, password).subscribe({
        next: data => {
          console.log(data);
          this.isSuccessful = true;
          this.signUpFailed = false;
          this.router.navigate(['auth/login']);
        },
        error: err => {
          this.errorMessage = err.message;
          this.signUpFailed = true;
        }
      });
    }
    this.formGroup = this.createForm();
  }
}
