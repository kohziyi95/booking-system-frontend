import { EventDetails } from './../../../models';
import { AdminService } from './../../../services/admin.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

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
  eventList!: EventDetails[];
  currentEventList!: String;

  ngOnInit(): void {
    this.showAllEvents();
  }

  // ngAfterViewInit(): void {
  //   switch (this.currentEventList) {
  //     case 'all':
  //       this.showAllEvents();
  //       break;
  //     case 'single':
  //       this.showSingleEvent();
  //       break;
  //     case 'multiple':
  //       this.showMultipleEvent();
  //       break;
  //     default:
  //       this.showAllEvents();
  //       break;
  //   }
  // }

  showSingleEvent() {
    this.adminService.getSingleEvent().subscribe((data) => {
      console.info('Showing single day events: ', data);
      this.eventList = data as EventDetails[];
      this.currentEventList = 'single';
    });
  }

  showMultipleEvent() {
    this.adminService.getMultipleEvent().subscribe((data) => {
      console.info('Showing multiple day events: ', data);
      this.eventList = data as EventDetails[];
      this.currentEventList = 'multiple';
    });
  }

  showAllEvents() {
    this.adminService.getAllEvents().subscribe((data) => {
      console.info('Showing all events: ', data);
      this.eventList = data as EventDetails[];
      this.currentEventList = 'all';
    });
  }

  deleteEvent(id: number) {
    this.adminService.deleteEvent(id).subscribe((data) => {
      console.info('Deleted event id: ', data);
      switch (this.currentEventList) {
        case 'all':
          this.showAllEvents();
          break;
        case 'single':
          this.showSingleEvent();
          break;
        case 'multiple':
          this.showMultipleEvent();
          break;
        default:
          this.showAllEvents();
          break;
      }
    });
  }

  isSingleEvent(e: EventDetails): boolean {
    return e.days == 'single';
  }

  isMultipleEvent(e: EventDetails): boolean {
    return e.days == 'multiple';
  }

  getImageFromBase64(base64String: String) {
    return this._sanitizer.bypassSecurityTrustResourceUrl(
      'data:image/jpg;base64,' + base64String
    );
  }
}
