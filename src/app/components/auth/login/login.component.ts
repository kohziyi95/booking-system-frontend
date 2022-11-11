import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formGroup = this.createForm();
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
      this.router.navigate(['dashboard']);
    }
  }

  formGroup!: FormGroup;
  isLoggedIn = false;
  loginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  username?: string = (this.username = this.storageService.getUser().username);

  createForm(): FormGroup {
    return this.fb.group({
      username: this.fb.control<string>('', [
        Validators.minLength(3),
        Validators.required,
      ]),
      password: this.fb.control<string>('', [
        Validators.minLength(8),
        Validators.required,
      ]),
    });
  }

  processLogin() {
    console.info('Logging in >>>>>>>>>', this.formGroup.value);

    const { username, password } = this.formGroup.value;

    this.authService.login(username, password).subscribe({
      next: (data) => {
        this.storageService.saveUser(data);

        this.loginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.storageService.getUser().roles;
        this.reloadPage();
      },
      error: (err) => {
        console.error('Error', err);
        this.errorMessage = err.message;
        this.loginFailed = true;
      },
    });
    this.formGroup = this.createForm();
    
  }

  reloadPage(): void {
    window.location.reload();
  }
}
