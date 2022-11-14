import { EventBooking, EventDetails } from './../models';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


const ADMIN_API = '/api/admin/';
const EVENT_API = '/api/event/'
@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}

  // public addEvent(event: EventDetails) {
  //   const headers = new HttpHeaders()
  //     .set('Content-Type', 'application/json')
  //     .set('Accept', 'application/json');

  //   return firstValueFrom(
  //     this.http.post(ADMIN_API + 'addEvent', event, { headers })
  //   );
  // }

  public addEvent(eventDetails: EventDetails, image: File) {
    const data = new FormData();
    data.set('eventDetails', JSON.stringify(eventDetails));
    data.set('image', image);
    return firstValueFrom(this.http.post(ADMIN_API + 'addEvent', data));
  }

  public editEventWithNewImage(eventDetails: EventDetails, image: File) {
    const data = new FormData();
    data.set('eventDetails', JSON.stringify(eventDetails));
    data.set('image', image);
    return firstValueFrom(this.http.post(ADMIN_API + 'editEventNewImage', data));
  }

  public editEvent(eventDetails: EventDetails) {
    const data = new FormData();
    data.set('eventDetails', JSON.stringify(eventDetails));
    return firstValueFrom(this.http.post(ADMIN_API + 'editEvent', data)); 

  }

  public getSingleEvent():Observable<EventDetails[]>{
    return (this.http.get<EventDetails[]>(`${EVENT_API}single`)).pipe();
  }

  public getMultipleEvent():Observable<EventDetails[]>{
    return (this.http.get<EventDetails[]>(`${EVENT_API}multiple`)).pipe();
  }

  public getAllEvents():Observable<EventDetails[]>{
    return (this.http.get<EventDetails[]>(`${EVENT_API}all`)).pipe();
  }

  public deleteEvent(id:number):Observable<EventDetails[]>{
    return (this.http.delete<EventDetails[]>(ADMIN_API + `event/${id}`)).pipe();
  }

  public getEvent(id:number):Promise<EventDetails>{
    return firstValueFrom(this.http.get<EventDetails>(`${EVENT_API}${id}`));
  }

  public getUserFromId(id:number):Promise<EventDetails>{
    return firstValueFrom(this.http.get<EventDetails>(`${ADMIN_API}user/${id}`));
  }



}
