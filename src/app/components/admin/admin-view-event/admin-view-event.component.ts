import { WalletService } from './../../../services/wallet.service';
import { BookingService } from './../../../services/booking.service';
import { EventDetails, EventBooking, EmailDetails } from './../../../models';
import { AdminService } from './../../../services/admin.service';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { EmailService } from 'src/app/services/email.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

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
    private emailService: EmailService,
    private walletService: WalletService,
    private router: Router,
    private dialogRef: MatDialog
  ) {}

  ngOnInit(): void {
    this.showAllEvents();
    if (this.isUser()) {
      this.getAllBookingsByUser();
    }
    console.info('booking list >>> ', this.bookingList);
    this.getCurrentCredits();
  }

  imagePath!: any;
  eventList!: EventDetails[];
  currentEventList!: string;
  bookingList!: EventBooking[];

  userId = this.storageService.getUser().id;
  currentUser = this.storageService.getUser();

  loading: boolean = false;
  currentCredits!: number;
  bookingFailed!: boolean;
  refundFailed!: boolean;
  transactionType: string = '';
  errorMessage!: string;
  emailDetails!: EmailDetails;
  bookingId!: string;
  roles?: string[] = (this.roles = this.storageService.getUser().roles);

  getAllBookingsByUser() {
    // let userId = this.storageService.getUser().id;
    this.bookingService.getBookingsByUser(this.userId).subscribe((data) => {
      console.info(
        'Showing all bookings for user Id ' + this.userId + ' >>>>>> ',
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

  getCurrentCredits() {
    this.walletService.getCredits(this.userId).then((data) => {
      console.log('Credits retrieved: ', data);
      this.currentCredits = Object(data)['credits'];
    });
  }

  bookEvent(event: EventDetails) {
    this.loading = true;
    this.transactionType = 'bookEvent';
    const id = event.id;
    console.log('Booking Event Id: ', id);
    console.log('User Id: ', this.userId);
    let bookingId!: string;
    if (event.price <= this.currentCredits) {
      this.bookingService
        .bookEvent(id, this.userId)
        .then((data) => {
          console.log('Booking data >>>>>>>>>>> ', data);
          if (Object(data)['statusCode'] == 200) {
            bookingId = Object(data)['bookingId'];
            this.bookingFailed = false;
            this.emailDetails = {
              recipient: this.currentUser.email,
              msgBody: `Dear ${this.currentUser.username}, \n 
            Your booking of the event ${event.title} has been confirmed. \n
            Your booking id is: ${bookingId}. \n
            Thank you for booking with us.\n
            \n
            Regards,\n
            Booking System Admin`,
              subject: `Your Booking Has Been Confirmed: ${bookingId}`,
            };
            this.emailService
              .sendConfirmationEmail(this.emailDetails)
              .then((data) => {
                console.log('Email Details: ', this.emailDetails);
                console.log('Email status: ', data);
                // alert(`Email Status:  ${data} \n
                // ${emailDetails.msgBody}`);
                this.openDialog();

                // window.location.reload();
                // this.reload();
              });
          } else {
            this.bookingFailed = true;
            this.errorMessage = Object(data)['message'];
            this.openDialog();
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      this.bookingFailed = true;
      console.log('Booking failed. Insufficient Credits.');
      this.errorMessage = 'You do not have sufficient credits in your wallet.';
      this.openDialog();
    }
  }

  cancelBooking(event: EventDetails) {
    this.loading = true;
    this.transactionType = 'cancelBooking';
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
    });
  }

  openDialog() {
    const dialogRef = this.dialogRef.open(BookingDialog, {
      width: '500px',
      data: {
        bookingFailed: this.bookingFailed,
        errorMessage: this.errorMessage,
        emailDetails: this.emailDetails,
        refundFailed: this.refundFailed,
        transactionType: this.transactionType,
        bookingId: this.bookingId,
      },
    });
  }

  showEventDialog(e: EventDetails) {
    const dialogRef = this.dialogRef.open(EventDialog, {
      height: '800px',
      width: '800px',
      data: {
        event: e,
        remainingSlots: this.remainingSlots(e),
        loading: this.loading,
        roles: this.roles,
      },
    });
  }
}

@Component({
  selector: 'booking-dialog',
  templateUrl: 'booking-dialog.html',
})
export class BookingDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      bookingFailed: boolean;
      refundFailed: boolean;
      errorMessage: string;
      emailDetails: EmailDetails;
      transactionType: string;
      bookingId: string;
    }
  ) {}

  reload() {
    window.location.reload();
  }

  emailArray = this.data.emailDetails?.msgBody.split('.');
}

export interface BookingElement {
  bookingId: string;
  username: string;
  email: string;
}
@Component({
  selector: 'event-dialog',
  templateUrl: 'event-dialog.html',
})
export class EventDialog implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      event: EventDetails;
      remainingSlots: number;
      loading: boolean;
      roles: string[];
    },
    private _sanitizer: DomSanitizer,
    private bookingService: BookingService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    if (this.isAdmin()) {
      this.getAllBookingsByEvent(this.data.event);
    }
  }

  reload() {
    window.location.reload();
  }

  isSingleEvent(e: EventDetails): boolean {
    return e.days == 'single';
  }

  isMultipleEvent(e: EventDetails): boolean {
    return e.days == 'multiple';
  }

  isAdmin(): boolean | undefined {
    return this.data.roles?.includes('ROLE_ADMIN');
  }

  isUser(): boolean | undefined {
    return this.data.roles?.includes('ROLE_USER') && !this.isAdmin();
  }

  getImageFromBase64(base64String: String) {
    return this._sanitizer.bypassSecurityTrustResourceUrl(
      'data:image/jpg;base64,' + base64String
    );
  }

  bookingList: EventBooking[] = [];
  newList: BookingElement[] = [];
  user!: any;

  populateList() {
    this.bookingList.forEach((booking) => {
      this.getUserFromId(booking.userId).then(() => {
        const user = this.user;
        console.log('User data', this.user);
        let username = Object(user)['username'] as string;
        let email = Object(user)['email'] as string;
        // console.log('Username', Object(user)['username'] as string);
        let obj: BookingElement = {
          bookingId: booking.bookingId,
          username: username,
          email: email,
        };
        // this.newList.push(obj);
        this.newList = [...this.newList, obj];
      });

      // console.log("User data",this.user)

      // let username = Object(user)['username'] as string;
      // let email = Object(user)['email'] as string
      // console.log("Username", Object(user)['username'] as string)
      // let obj:BookingElement = {
      //   bookingId: booking.bookingId,
      //   username: username,
      //   email: email,
      // };
      // this.newList.push(obj);
      // this.newList = [...this.newList, obj];
    });
  }

  getAllBookingsByEvent(e: EventDetails) {
    // let userId = this.storageService.getUser().id;
    this.bookingService.getBookingsByEvent(e.id).subscribe((data) => {
      console.info(
        'Showing all bookings for Event Id ' + e.id + ' >>>>>> ',
        data
      );
      this.bookingList = data as EventBooking[];
      this.populateList();
    });
  }
  async getUserFromId(id: number) {
    let user = {};
    return this.adminService.getUserFromId(id).then((data) => {
      // console.log('User', data);
      user = data as any;
      this.user = user;
    });
  }

  displayedColumns: string[] = ['bookingId', 'username', 'email'];
}
