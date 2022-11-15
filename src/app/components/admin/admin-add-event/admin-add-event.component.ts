import { AdminService } from './../../../services/admin.service';
import { EventDetails } from './../../../models';
import { StorageService } from 'src/app/services/storage.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as e from 'express';

@Component({
  selector: 'app-admin-add-event',
  templateUrl: './admin-add-event.component.html',
  styleUrls: ['./admin-add-event.component.css'],
})
export class AdminAddEventComponent implements OnInit {
  constructor(
    private storageService: StorageService,
    private fb: FormBuilder,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.newEventForm = this.createForm();
  }

  roles?: string[] = (this.roles = this.storageService.getUser().roles);
  isAdmin(): boolean | undefined {
    return this.roles?.includes('ROLE_ADMIN');
  }

  newEventForm!: FormGroup;
  startTime!: any;

  // imageUrl() {};
  @ViewChild('toUpload')
  toUpload!: ElementRef;

  createForm(): FormGroup {
    return this.fb.group({
      title: this.fb.control<string>('', [
        Validators.required,
        Validators.minLength(5),
      ]),
      description: this.fb.control<string>('', [
        Validators.required,
        Validators.maxLength(400),
      ]),
      days: this.fb.control<string>('single', [Validators.required]),
      date: this.fb.control<any>('', [Validators.required]),
      startDate: this.fb.control<any>('', [Validators.required]),
      endDate: this.fb.control<any>('', [Validators.required]),
      startTime: this.fb.control<any>('',  [Validators.required]),
      endTime: this.fb.control<any>('', [Validators.required]),
      // frequency: this.fb.control<string>('',[Validators.required]),
      image: this.fb.control<any>(''),
      price: this.fb.control<number>(0, [Validators.required]),
      capacity: this.fb.control<number>(0),
    });
  }

  isSingleDayEvent() {
    return this.newEventForm.get('days')?.value == 'single';
  }

  // imageUploaded() {
  //   console.info(this.newEventForm.get('image'));
  // }

  eventAdded: boolean = false;
  // eventTitle!:string;
  eventDetails!: EventDetails;
  formSubmitted: boolean = false;
  errorMessage!: string;
  loading: boolean = false;

  processForm() {
    this.loading = true;
    console.info(this.newEventForm.value);
    console.info('>>> toUpload: ', this.toUpload.nativeElement.files[0]);
    const image = this.toUpload.nativeElement.files[0];
    this.eventDetails = this.newEventForm.value as EventDetails;
    this.eventDetails.image = image;
    if (this.eventDetails.days == 'single') {
      this.eventDetails.date = this.newEventForm
        .get('date')
        ?.value.toDateString();
    } else {
      this.eventDetails.startDate = this.newEventForm
        .get('startDate')
        ?.value.toDateString();
      this.eventDetails.endDate = this.newEventForm
        .get('endDate')
        ?.value.toDateString();
    }
    console.info('Event Details >>>> ', this.eventDetails);
    this.formSubmitted = true;
    this.adminService
      .addEvent(this.eventDetails, image)
      .then((result) => {
        console.info('>>> result', result);
        this.eventAdded = true;
        this.loading = false;
      })
      .catch((error) => {
        console.error('>>error', error);
        this.errorMessage = error;
        this.eventAdded = false;
        this.loading = false;
      });
    // this.eventTitle = this.newEventForm.get("title")?.value;
    this.newEventForm = this.createForm();
  }

  resetForm() {
    this.newEventForm = this.createForm();
    this.eventAdded = false;
    this.formSubmitted = false;
    this.eventDetails = this.newEventForm.value as EventDetails;
  }

  refreshPage(){
    window.location.reload();
  }
}
