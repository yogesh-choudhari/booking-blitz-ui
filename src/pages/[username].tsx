
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
    onError: (err) => {
      toast({
        title: "Error loading calendar",
        description: err instanceof Error ? err.message : "Failed to load availability",
        variant: "destructive",
      });
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-3xl px-4 py-12">
        {/* Error display is handled by toast now */}
        
        {/* Main content area with card-like design */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-8 border-b border-gray-100 dark:border-gray-700">
            {/* Profile header */}
            {availabilityData && (
              <UserHeader 
                user={availabilityData.data.user} 
                timezone={availabilityData.data.timezone} 
              />
            )}
          </div>
          
          <div className="p-8">
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
