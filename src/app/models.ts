export interface EventDetails {
  id:number;
  date: string;
  days: string;
  description: string;
  endDate: string;
  endTime: string;
  image: any;
  startDate: string;
  startTime: string;
  title: string;
  price: number;
  capacity: number;
  bookingCount: number;
}

export interface EventBooking {
  bookingId: string;
  eventId: number;
  userId: number;
}

export interface EmailDetails {
  recipient: string;
  msgBody: string;
  subject: string;
}