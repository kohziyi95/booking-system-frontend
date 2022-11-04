import { AdminService } from './../../../services/admin.service';
import { EventDetails } from './../../../models';
import { StorageService } from 'src/app/services/storage.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-edit-event',
  templateUrl: './admin-edit-event.component.html',
  styleUrls: ['./admin-edit-event.component.css'],
})
export class AdminEditEventComponent implements OnInit {
  constructor(
    private storageService: StorageService,
    private fb: FormBuilder,
    private adminService: AdminService,
    private activatedRoute: ActivatedRoute,
    private _sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.adminService
      .getEvent(this.id)
      .then((data) => {
        this.eventDetails = data as EventDetails;
        console.log('event details: ', this.eventDetails);
        this.currentImage = this.eventDetails.image;
        this.eventId = this.eventDetails.id;
      })
      .then(() => {
        this.newEventForm = this.createForm();
      });
  }

  id: number = this.activatedRoute.snapshot.params['id'];
  roles?: string[] = (this.roles = this.storageService.getUser().roles);
  isAdmin(): boolean | undefined {
    return this.roles?.includes('ROLE_ADMIN');
  }

  newEventForm!: FormGroup;
  startTime!: any;
  eventEdited: boolean = false;
  // eventTitle!:string;
  eventDetails!: EventDetails;
  formSubmitted: boolean = false;
  errorMessage!: string;
  currentImage!:any; 
  eventId!:number;
  // imageUrl() {};
  @ViewChild('toUpload')
  toUpload!: ElementRef;

  createForm(): FormGroup {
    return this.fb.group({
      title: this.fb.control<string>(this.eventDetails.title, [
        Validators.required,
        Validators.minLength(5),
      ]),
      description: this.fb.control<string>(this.eventDetails.description, [
        Validators.required,
        Validators.maxLength(400),
      ]),
      days: this.fb.control<string>(this.eventDetails.days, [
        Validators.required,
      ]),
      date: this.fb.control<any>(this.eventDetails.date),
      startDate: this.fb.control<any>(this.eventDetails.startDate),
      endDate: this.fb.control<any>(this.eventDetails.endDate),
      startTime: this.fb.control<any>(this.eventDetails.startTime),
      endTime: this.fb.control<any>(this.eventDetails.endTime),
      // frequency: this.fb.control<string>('',[Validators.required]),
      image: this.fb.control<any>(''),
      price: this.fb.control<number>(this.eventDetails.price, [
        Validators.required,
      ]),
      capacity: this.fb.control<number>(this.eventDetails.capacity),
    });
  }

  isSingleDayEvent() {
    return this.newEventForm.get('days')?.value == 'single';
  }

  getImageFromBase64(base64String: String) {
    return this._sanitizer.bypassSecurityTrustResourceUrl(
      'data:image/jpg;base64,' + base64String
    );
  }

  processForm() {
    let image!: any;
    console.info(this.newEventForm.value);
    this.eventDetails = this.newEventForm.value as EventDetails;
    this.eventDetails.id = this.eventId;
    if (this.newEventForm.get('image')?.dirty) {
      console.info('>>> toUpload: ', this.toUpload.nativeElement.files[0]);
      image = this.toUpload.nativeElement.files[0];
      this.eventDetails.image = image;
    } else {
      this.eventDetails.image = this.currentImage;
    }

    if (this.eventDetails.days == 'single') {
      if (this.newEventForm.get('date')?.dirty) {
        this.eventDetails.date = this.newEventForm
          .get('date')
          ?.value.toDateString();
      }
    } else {
      if (this.newEventForm.get('startDate')?.dirty) {
        this.eventDetails.startDate = this.newEventForm
          .get('startDate')
          ?.value.toDateString();
        this.eventDetails.endDate = this.newEventForm
          .get('endDate')
          ?.value.toDateString();
      }
    }
    console.info('Event Details >>>> ', this.eventDetails);
    this.formSubmitted = true;
    if (this.newEventForm.get('image')?.dirty) {
      this.adminService
        .editEventWithNewImage(this.eventDetails, this.eventDetails.image)
        .then((result) => {
          console.info('>>> result', result);
          this.eventEdited = true;
        })
        .catch((error) => {
          console.error('>>error', error);
          this.errorMessage = error.message;
          this.eventEdited = false;
        });
    } else {
      this.adminService
        .editEvent(this.eventDetails)
        .then((result) => {
          console.info('>>> result', result);
          this.eventEdited = true;
        })
        .catch((error) => {
          console.error('>>error', error);
          this.errorMessage = error.message;
          this.eventEdited = false;
        });
    }

    this.newEventForm = this.createForm();
  }

  resetForm() {
    this.newEventForm = this.createForm();
    this.eventEdited = false;
    this.formSubmitted = false;
    this.eventDetails = this.newEventForm.value as EventDetails;
  }
}
