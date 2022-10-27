import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'client';

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router:Router,
  ) {}

  roles?: string[] = (this.roles = this.storageService.getUser().roles);

  isAdmin():boolean | undefined {
    return this.roles?.includes("ROLE_ADMIN");
  }

  isUser():boolean | undefined {
    return this.roles?.includes("ROLE_USER") && !this.roles?.includes("ROLE_ADMIN");
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: res => {
        console.log(res);
        this.storageService.clean();

        window.location.reload();
        alert("Log out successful");
      },
      error: err => {
        console.log(err);
      }
    });
    this.router.navigate(["/auth/login"]);
    
  }
}
