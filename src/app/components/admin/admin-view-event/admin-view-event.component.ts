import { AdminService } from './../../../services/admin.service';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EventDetails } from 'src/app/models';

@Component({
  selector: 'app-admin-view-event',
  templateUrl: './admin-view-event.component.html',
  styleUrls: ['./admin-view-event.component.css'],
})
export class AdminViewEventComponent implements OnInit {
  constructor(
    private adminService: AdminService,
    private _sanitizer: DomSanitizer
  ) {}
  imagePath!: any;
  eventList!:EventDetails[];

  ngOnInit(): void {
    this.showSingleEvent();
  }

  showSingleEvent() {
    this.adminService.getSingleEvent().subscribe((data) => {
      console.info(data); 
      this.eventList=data as EventDetails[];
    });
  }

  getImageFromBase64(base64String:String){
    return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' 
    + base64String);
  }
}
