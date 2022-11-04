import { BookingService } from './../../../services/booking.service';
import { EventDetails, EventBooking } from './../../../models';
import { AdminService } from './../../../services/admin.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-view-event',
  templateUrl: './admin-view-event.component.html',
  styleUrls: ['./admin-view-event.component.css'],
})
export class AdminViewEventComponent implements OnInit {
  constructor(
    private adminService: AdminService,
    private bookingService: BookingService,
    private _sanitizer: DomSanitizer,
    private storageService: StorageService,
    private router: Router
  ) {}
  imagePath!: any;
  eventList!: EventDetails[];
  currentEventList!: string;

  bookingList!: EventBooking[];

  ngOnInit(): void {
    this.showAllEvents();
    this.getAllBookingsByUser();
    console.info('booking list >>> ', this.bookingList);
  }

  getAllBookingsByUser() {
    let userId = this.storageService.getUser().id;
    this.bookingService.getBookingsByUser(userId).subscribe((data) => {
      console.info(
        'Showing all bookings for user Id ' + userId + ' >>>>>> ',
        data
      );
      this.bookingList = data as EventBooking[];
    });
  }

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
      this.reload();
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

  roles?: string[] = (this.roles = this.storageService.getUser().roles);

  isAdmin(): boolean | undefined {
    return this.roles?.includes('ROLE_ADMIN');
  }

  isUser(): boolean | undefined {
    return this.roles?.includes('ROLE_USER') && !this.isAdmin();
  }

  editEvent(id: number) {
    this.router.navigate(['/admin/event/edit', id]);
  }

  remainingSlots(event: EventDetails): number {
    return event.capacity - event.bookingCount;
  }

  reload() {
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
    // this.getAllBookingsByUser();
  }

  bookingExists(e: EventDetails) {
    let bookingExists = false;
    if (this.bookingList.length == 0) {
      return false;
    }
    this.bookingList.forEach((booking) => {
      if (booking.eventId == e.id) {
        bookingExists = true;
      }
    });
    return bookingExists;
  }

  bookEvent(id: number) {
    console.log('Booking Event Id: ', id);
    const userId = this.storageService.getUser().id;
    console.log('User Id: ', userId);
    let bookingId!: string;
    this.bookingService
      .bookEvent(id, userId)
      .then((data) => {
        console.log('Booking data >>>>>>>>>>> ', data);
        bookingId = data as string;
        window.location.reload();
        this.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  }  

  cancelBooking(event: EventDetails) {
    let bookingId!: string;
    this.bookingList.forEach((e) => {
      // console.info('Deleting booking id: ', e);
      // console.info('Event Id >>> ', e.eventId)
      if (event.id == e.eventId) {
        bookingId = e.bookingId;
      }
    });
    // console.info("booking list >>> ", this.bookingList)
    // console.info('Deleting booking id: ', bookingId);

    this.bookingService
      .deleteBookingByBookingId(bookingId)
      .subscribe((data) => {
        console.info('Deleted booking id: ', data as string);
        window.location.reload();
        this.reload();
      });
  }
}
