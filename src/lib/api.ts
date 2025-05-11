
import { AvailabilityResponse, BookingRequest, BookingResponse } from "@/types/calendar";

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
    const response = await fetch(
      `${API_BASE_URL}/${username}/availability?date=${date}`
    );
    
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
    console.log("Availability data received:", data);
    return data;
  } catch (error) {
    console.error("Error fetching availability:", error);
    throw error;
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
  } catch (error) {
    console.error("Error booking time slot:", error);
    throw error;
  }
}
