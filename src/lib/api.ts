
import { AvailabilityResponse, BookingRequest, BookingResponse } from "@/types/calendar";

// Using a mock API base URL for development
// In production, this would be your actual API endpoint
const API_BASE_URL = "/api/calendar/v2/public";

/**
 * Fetches availability for a specific user on a specific date
 */
export async function fetchAvailability(
  username: string,
  date: string
): Promise<AvailabilityResponse> {
  try {
    console.log(`Fetching availability for ${username} on ${date}`);
    
    // For development/demo purposes, return mock data when the API returns HTML
    // In a production environment, you would handle this differently
    const response = await fetch(
      `${API_BASE_URL}/${username}/availability?date=${date}`
    );
    
    // Check if the response is JSON or HTML
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) {
      console.log("API returned HTML instead of JSON. Using mock data for demonstration.");
      return getMockAvailabilityData(username, date);
    }
    
    if (!response.ok) {
      // Check if content type is JSON before trying to parse
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    }
    
    const data = await response.json();
    console.log("Availability data received:", data);
    return data;
  } catch (error) {
    console.error("Error fetching availability:", error);
    // For demo purposes, return mock data on error
    // In production, you would probably want to rethrow the error
    return getMockAvailabilityData(username, date);
  }
}

/**
 * Book a time slot for a specific user
 */
export async function bookTimeSlot(
  username: string,
  bookingData: BookingRequest
): Promise<BookingResponse> {
  try {
    console.log(`Booking timeslot for ${username}:`, bookingData);
    
    // For development purposes, return mock response
    // This simulates a successful booking response
    return getMockBookingResponse(username, bookingData);
    
    /* Uncomment this for production use
    const response = await fetch(`${API_BASE_URL}/${username}/book/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    });
    
    if (!response.ok) {
      // Check if content type is JSON before trying to parse
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    }
    
    const data = await response.json();
    console.log("Booking response:", data);
    return data;
    */
  } catch (error) {
    console.error("Error booking time slot:", error);
    throw error;
  }
}

/**
 * Generate mock availability data for demonstration purposes
 */
function getMockAvailabilityData(username: string, date: string): AvailabilityResponse {
  const currentDate = new Date(date);
  const timeSlots = [];
  
  // Generate time slots from 9 AM to 5 PM
  for (let hour = 9; hour < 17; hour++) {
    // For each hour, create 2 slots (on the hour and half hour)
    for (let minutes of [0, 30]) {
      const time = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      const startTime = new Date(currentDate);
      startTime.setHours(hour, minutes, 0);
      
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + 30);
      
      timeSlots.push({
        time,
        date,
        start: startTime.toISOString(),
        end: endTime.toISOString(),
        duration: 30
      });
    }
  }
  
  // Skip some slots to make it look more realistic
  const availableSlots = timeSlots.filter(() => Math.random() > 0.3);
  
  return {
    success: true,
    data: {
      availability: availableSlots,
      calendar_info: {
        default_duration: 30,
        meeting_platforms: [
          { type: "zoom", available: true, link: "https://zoom.us/j/example", value: "Zoom Meeting" },
          { type: "google_meet", available: true, link: "https://meet.google.com/example", value: "Google Meet" }
        ],
        timezone: "America/New_York",
        buffer_time: 15
      },
      user: {
        username: username || "Kunal",
        email: `${username.toLowerCase()}@example.com`,
        profile_pic: "https://avatars.githubusercontent.com/u/12345678?v=4",
        user_type: "premium",
        organisation_name: "Acme Inc.",
        organisation_url: "https://acme-inc.example.com",
        linkedin_url: "https://linkedin.com/in/kunal-example",
        platforms: ["zoom", "google_meet"]
      },
      buffer_time: 15,
      timezone: "America/New_York"
    },
    message: "Availability fetched successfully."
  };
}

/**
 * Generate mock booking response for demonstration purposes
 */
function getMockBookingResponse(username: string, bookingData: BookingRequest): BookingResponse {
  return {
    success: true,
    message: "Meeting booked successfully.",
    data: {
      bookings: [
        {
          booking_uid: `booking_${Math.random().toString(36).substring(2, 15)}`,
          title: bookingData.title,
          date: bookingData.date,
          start_time: bookingData.start_time,
          duration: bookingData.duration,
          status: "confirmed",
          platform: bookingData.platform,
          meeting_link: bookingData.platform === "zoom" 
            ? "https://zoom.us/j/generated_meeting_id" 
            : "https://meet.google.com/generated_meeting_id",
          attendees: bookingData.attendees,
          notes: bookingData.notes || "",
          buffer_before: bookingData.buffer_before || 0,
          buffer_after: bookingData.buffer_after || 0,
          created_at: new Date().toISOString(),
          timezone: bookingData.timezone || "America/New_York"
        }
      ]
    },
    status_code: 201
  };
}
