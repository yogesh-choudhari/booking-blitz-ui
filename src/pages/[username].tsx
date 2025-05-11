
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';

import UserHeader from '@/components/UserHeader';
import DateSelector from '@/components/DateSelector';
import TimeSlotGrid from '@/components/TimeSlotGrid';
import BookingModal from '@/components/BookingModal';
import BookingSuccess from '@/components/BookingSuccess';

import { fetchAvailability, bookTimeSlot } from '@/lib/api';
import { TimeSlot, BookingFormInputs, Booking } from '@/types/calendar';
import { useToast } from '@/components/ui/use-toast';

const UserCalendarPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { toast } = useToast();
  
  // Modal states
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Success states
  const [bookingResult, setBookingResult] = useState<Booking | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState<boolean>(false);

  // Fetch availability data with React Query
  const { data: availabilityData, isLoading, error, refetch } = useQuery({
    queryKey: ['availability', username, format(selectedDate, 'yyyy-MM-dd')],
    queryFn: () => fetchAvailability(username || '', format(selectedDate, 'yyyy-MM-dd')),
    enabled: !!username,
    retry: 1,
    meta: {
      onError: (error: unknown) => {
        toast({
          title: "Error loading calendar",
          description: error instanceof Error ? error.message : "Failed to load availability",
          variant: "destructive",
        });
      }
    }
  });

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
        refetch();
      }
    } catch (err) {
      toast({
        title: "Booking failed",
        description: err instanceof Error ? err.message : "Failed to book appointment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
    setIsSuccessOpen(false);
  };

  if (!username) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">User not found</h1>
          <p className="text-gray-500 dark:text-gray-400">Please check the URL and try again.</p>
        </div>
      </div>
    );
  }

  // Setup error handling using the error from useQuery
  if (error) {
    // We'll display the error via toast, but we can still render the UI with proper error state
    console.error("Error fetching availability:", error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        {/* Modern Design Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-700">
          {/* Section 1: User Profile Header */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 opacity-70"></div>
            <div className="relative p-8 border-b border-gray-100 dark:border-gray-700">
              {/* Profile header */}
              {availabilityData && (
                <UserHeader 
                  user={availabilityData.data.user} 
                  timezone={availabilityData.data.timezone} 
                />
              )}
            </div>
          </div>
          
          {/* Section 2 & 3: Calendar and Time Slots */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Section 2: Calendar with Date Selector */}
            <div className="md:col-span-1">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Select Date</h2>
              <DateSelector 
                selectedDate={selectedDate} 
                onDateChange={handleDateChange} 
              />
            </div>
            
            {/* Section 3: Time Slots Grid */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Available Times</h2>
              <TimeSlotGrid 
                availableSlots={availabilityData?.data.availability || []} 
                onSelectTimeSlot={handleSelectTimeSlot}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Booking explanatory text */}
        <div className="mt-8 text-center px-4">
          <p className="text-gray-600 dark:text-gray-400">
            Select an available time slot to schedule your meeting with {username}.
          </p>
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
      
      <BookingSuccess 
        isOpen={isSuccessOpen} 
        onClose={handleCloseSuccess} 
        booking={bookingResult} 
      />
    </div>
  );
};

export default UserCalendarPage;
