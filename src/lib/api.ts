
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
    const response = await fetch(
      `${API_BASE_URL}/${username}/availability?date=${date}`
    );
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
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
    const response = await fetch(`${API_BASE_URL}/${username}/book/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error booking time slot:", error);
    throw error;
  }
}
