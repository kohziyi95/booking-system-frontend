import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { EventBooking, EventDetails } from '../models';


const BOOKING_API = 'api/event/';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private http: HttpClient) {}

  public bookEvent(eventId: number, userId: number) {
    return firstValueFrom(
      this.http.post(
        `${BOOKING_API}${eventId}/book`,
        { userId: userId },
        // { responseType: 'text' }
      )
    );
  }

  public getBookingsByUser(userId: number): Observable<EventBooking[]> {
    return this.http
      .get<EventBooking[]>(`${BOOKING_API}bookings/user/${userId}`)
      .pipe();
  }

  public getBookingsByEvent(eventId: number): Observable<EventBooking[]> {
    return this.http
      .get<EventBooking[]>(`${BOOKING_API}bookings/event/${eventId}`)
      .pipe();
  }

  public deleteBookingByBookingId(bookingId: string){
    return firstValueFrom(this.http
      .delete(`${BOOKING_API}bookings/${bookingId}`));
  }

  // public getBookingCount(eventId: number) {
  //   return firstValueFrom(this.http.get(`/api/event/${eventId}/count`));
  // }
}
