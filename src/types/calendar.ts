
export interface AvailabilityResponse {
  success: boolean;
  data: {
    availability: TimeSlot[];
    calendar_info: CalendarInfo;
    user: UserInfo;
    buffer_time: number;
    timezone: string;
  };
  message: string;
}

export interface TimeSlot {
  time: string;
  date: string;
  start: string;
  end: string;
  duration: number;
}

export interface CalendarInfo {
  default_duration: number;
  meeting_platforms: MeetingPlatform[];
  timezone: string;
  buffer_time: number;
}

export interface MeetingPlatform {
  type: string;
  available: boolean;
  link?: string;
  value?: string;
}

export interface UserInfo {
  username: string;
  email: string;
  profile_pic: string | null;
  user_type: string;
  organisation_name: string | null;
  organisation_url: string | null;
  linkedin_url: string | null;
  platforms: string[];
}

export interface BookingRequest {
  title: string;
  date: string;
  start_time: string;
  duration: number;
  attendees: {
    name: string;
    email: string;
  }[];
  platform: string;
  recurring?: {
    frequency: string;
    until: string;
  } | null;
  timezone?: string;
  buffer_before?: number;
  buffer_after?: number;
  notes?: string;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  data: {
    bookings: Booking[];
  };
  status_code: number;
}

export interface Booking {
  booking_uid: string;
  title: string;
  date: string;
  start_time: string;
  duration: number;
  status: string;
  platform: string;
  meeting_link: string;
  attendees: {
    name: string;
    email: string;
  }[];
  notes: string;
  buffer_before: number;
  buffer_after: number;
  created_at: string;
  timezone: string;
}

export interface BookingFormInputs {
  name: string;
  email: string;
  notes: string;
}
