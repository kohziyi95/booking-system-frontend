import { EventDetails } from './../models';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

const ADMIN_API = '/api/admin/';

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

  public getSingleEvent():Observable<EventDetails[]>{
    // const params = new HttpParams().set('days', 'single')
    return (this.http.get<EventDetails[]>('/api/event/single')).pipe();
  }
}
