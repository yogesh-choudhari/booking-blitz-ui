
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';

import UserHeader from '@/components/UserHeader';
import DateSelector from '@/components/DateSelector';
import TimeSlotGrid from '@/components/TimeSlotGrid';
import BookingModal from '@/components/BookingModal';
import BookingSuccess from '@/components/BookingSuccess';

import { fetchAvailability, bookTimeSlot } from '@/lib/api';
import { TimeSlot, BookingFormInputs, AvailabilityResponse, Booking } from '@/types/calendar';

const UserCalendarPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availabilityData, setAvailabilityData] = useState<AvailabilityResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Success states
  const [bookingResult, setBookingResult] = useState<Booking | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState<boolean>(false);

  useEffect(() => {
    const getAvailability = async () => {
      if (!username) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        const data = await fetchAvailability(username, formattedDate);
        setAvailabilityData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load availability');
        console.error('Error fetching availability:', err);
      } finally {
        setIsLoading(false);
      }
    };

    getAvailability();
  }, [username, selectedDate]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleSelectTimeSlot = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleBookingSubmit = async (formData: BookingFormInputs) => {
    if (!username || !selectedTimeSlot) return;
    
    setIsSubmitting(true);
    
    try {
      const bookingData = {
        title: `Meeting with ${formData.name}`,
        date: selectedTimeSlot.date,
        start_time: selectedTimeSlot.time,
        duration: selectedTimeSlot.duration,
        attendees: [
          {
            name: formData.name,
            email: formData.email
          }
        ],
        platform: availabilityData?.data.calendar_info.meeting_platforms[0]?.type || 'zoom',
        notes: formData.notes || ''
      };
      
      const response = await bookTimeSlot(username, bookingData);
      
      // Close the booking modal
      setIsModalOpen(false);
      
      // Show success confirmation
      if (response.success && response.data.bookings.length > 0) {
        setBookingResult(response.data.bookings[0]);
        setIsSuccessOpen(true);
        
        // Refresh availability after booking
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        const newAvailability = await fetchAvailability(username, formattedDate);
        setAvailabilityData(newAvailability);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to book appointment');
      console.error('Error booking appointment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
    setIsSuccessOpen(false);
  };

  if (!username) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">User not found</h1>
          <p className="text-gray-500">Please check the URL and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-3xl px-4 py-8">
        {/* Header area with error display */}
        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        ) : null}
        
        {/* Profile header */}
        {availabilityData && (
          <UserHeader 
            user={availabilityData.data.user} 
            timezone={availabilityData.data.timezone} 
          />
        )}
        
        {/* Main content area */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Date selector */}
          <DateSelector 
            selectedDate={selectedDate} 
            onDateChange={handleDateChange} 
          />
          
          {/* Time slots grid */}
          <TimeSlotGrid 
            availableSlots={availabilityData?.data.availability || []} 
            onSelectTimeSlot={handleSelectTimeSlot}
            isLoading={isLoading}
          />
        </div>
      </div>
      
      {/* Booking modal */}
      <BookingModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSubmit={handleBookingSubmit} 
        selectedSlot={selectedTimeSlot} 
        isSubmitting={isSubmitting}
      />
      
      {/* Success confirmation */}
      <BookingSuccess 
        isOpen={isSuccessOpen} 
        onClose={handleCloseSuccess} 
        booking={bookingResult} 
      />
    </div>
  );
};

export default UserCalendarPage;
