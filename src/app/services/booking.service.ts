import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { EventBooking, EventDetails } from '../models';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private http: HttpClient) {}

  public bookEvent(eventId: number, userId: number) {
    return firstValueFrom(
      this.http.post(
        `/api/event/${eventId}/book`,
        { userId: userId },
        // { responseType: 'text' }
      )
    );
  }

  public getBookingsByUser(userId: number): Observable<EventBooking[]> {
    return this.http
      .get<EventBooking[]>(`/api/event/bookings/user/${userId}`)
      .pipe();
  }

  public deleteBookingByBookingId(bookingId: string){
    return firstValueFrom(this.http
      .delete(`/api/event/bookings/${bookingId}`));
  }

  // public getBookingCount(eventId: number) {
  //   return firstValueFrom(this.http.get(`/api/event/${eventId}/count`));
  // }
}
