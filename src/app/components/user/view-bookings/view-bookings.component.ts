import { BookingService } from './../../../services/booking.service';
import { EventDetails, EventBooking } from './../../../models';
import { AdminService } from './../../../services/admin.service';
import { Component, Inject, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-bookings',
  templateUrl: './view-bookings.component.html',
  styleUrls: ['./view-bookings.component.css'],
})
export class ViewBookingsComponent implements OnInit {
  constructor(
    private adminService: AdminService,
    private bookingService: BookingService,
    private _sanitizer: DomSanitizer,
    private storageService: StorageService,
    private router: Router,
    private dialogRef: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllBookingsByUser();
  }

  bookingList!: EventBooking[];
  eventList: EventDetails[] = [];
  roles?: string[] = (this.roles = this.storageService.getUser().roles);

  isUser(): boolean | undefined {
    return this.roles?.includes('ROLE_USER') && !this.isAdmin();
  }

  isAdmin(): boolean | undefined {
    return this.roles?.includes('ROLE_ADMIN');
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

  getAllBookingsByUser() {
    let userId = this.storageService.getUser().id;
    this.bookingService.getBookingsByUser(userId).subscribe((data) => {
      console.info(
        'Showing all bookings for user Id ' + userId + ' >>>>>> ',
        data
      );
      this.bookingList = data as EventBooking[];
      this.getAllEventDetails();
    });
  }

  // getEventDetailsByEventId(eventId: number): EventDetails {
  //   let event!: EventDetails;
  //   this.adminService
  //     .getEvent(eventId)
  //     .then((data) => {
  //       event = data as EventDetails;
  //       console.log(`Getting Event ID ${eventId}: `, event);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  //   return event;
  // }

  getAllEventDetails() {
    this.eventList = [];
    this.bookingList.forEach((booking) => {
      // let event: EventDetails = this.getEventDetailsByEventId(booking.eventId);
      // console.log(event);
      this.adminService
        .getEvent(booking.eventId)
        .then((data) => {
          this.eventList.push(data as EventDetails);
          console.log(`Getting Event ID ${booking.eventId}: `, event);
        })
        .catch((error) => {
          console.error(error);
        });
    });
    console.log('Event List >>>> ', this.eventList);
    // return eventList;
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

    this.bookingService.deleteBookingByBookingId(bookingId).then((data) => {
      console.info('Deleted booking status: ', data);
      if (Object(data)['statusCode'] == 200) {
        this.refundFailed = false;
        this.bookingId = bookingId;
      } else {
        this.refundFailed = true;
        this.errorMessage = Object(data)['message'];
      }
      this.openDialog();
      // window.location.reload();
      // this.reload();
      this.getAllBookingsByUser();
    });
  }
  errorMessage!: string;
  refundFailed!: boolean;
  bookingId!: string;

  openDialog() {
    const dialogRef = this.dialogRef.open(RefundDialog, {
      width: '500px',
      data: {
        errorMessage: this.errorMessage,
        refundFailed: this.refundFailed,
      },
    });
  }
}
@Component({
  selector: 'refund-dialog',
  templateUrl: 'refund-dialog.html',
})
export class RefundDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      refundFailed: boolean;
      errorMessage: string;
      bookingId: string;
    }
  ) {}

  reload() {
    window.location.reload();
  }
}
