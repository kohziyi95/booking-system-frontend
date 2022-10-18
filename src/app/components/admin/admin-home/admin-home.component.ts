import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
})
export class AdminHomeComponent implements OnInit {
  constructor(private storageService: StorageService) {}

  ngOnInit(): void {}
  roles?: string[] = (this.roles = this.storageService.getUser().roles);

  isAdmin(): boolean | undefined {
    return this.roles?.includes('ROLE_ADMIN');
  }
}
