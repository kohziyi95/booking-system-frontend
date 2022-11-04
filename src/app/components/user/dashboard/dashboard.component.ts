import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(private storageService: StorageService) {}
  roles?: string[] = (this.roles = this.storageService.getUser().roles);

  ngOnInit(): void {}

  isAdmin(): boolean | undefined {
    return this.roles?.includes('ROLE_ADMIN');
  }
  
  isUser(): boolean | undefined {
    return this.roles?.includes('ROLE_USER') && !this.isAdmin();
  }
}
