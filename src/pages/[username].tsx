import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { Laptop, Moon, Sun, Sparkles, Bookmark, Clock, Calendar } from 'lucide-react';

import UserHeader from '@/components/UserHeader';
import DateSelector from '@/components/DateSelector';
import TimeSlotGrid from '@/components/TimeSlotGrid';
import BookingModal from '@/components/BookingModal';
import BookingSuccess from '@/components/BookingSuccess';

import { fetchAvailability, bookTimeSlot } from '@/lib/api';
import { TimeSlot, BookingFormInputs, Booking } from '@/types/calendar';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

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
  const { data: availabilityData, isLoading, error } = useQuery({
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
    console.error("Error fetching availability:", error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 flex flex-col">
      {/* Top App Bar with branded feel */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
        <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">BookingBlitz</span>
          </div>
          <div className="flex items-center space-x-3">
            <Bookmark className="h-5 w-5 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-primary transition-colors" />
            <span className="hidden sm:flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              <Laptop className="h-3.5 w-3.5" />
              <span>App</span>
            </span>
          </div>
        </div>
      </header>
      
      {/* Main Content Area */}
      <div className="flex-grow flex flex-col">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl">
          {/* Hero Section with User Profile */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 mb-8 shadow-sm">
            {availabilityData && (
              <UserHeader 
                user={availabilityData.data.user} 
                timezone={availabilityData.data.timezone} 
              />
            )}
          </div>
          
          {/* Calendar and Slots Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Calendar Column */}
            <div className="lg:col-span-4">
              <div className="sticky top-24">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  Select Date
                </h2>
                <DateSelector 
                  selectedDate={selectedDate} 
                  onDateChange={handleDateChange} 
                />
              </div>
            </div>
            
            {/* Time Slots Column */}
            <div className="lg:col-span-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                Available Times
              </h2>
              <TimeSlotGrid 
                availableSlots={availabilityData?.data.availability || []} 
                onSelectTimeSlot={handleSelectTimeSlot}
                isLoading={isLoading}
              />
              
              {/* Booking Explanatory Text with enhanced design */}
              <div className="mt-8 text-center px-4 py-4 bg-blue-50 dark:bg-gray-800 rounded-xl border border-blue-100 dark:border-gray-700">
                <div className="inline-flex items-center px-3 py-1 bg-white dark:bg-gray-700 rounded-full shadow-sm mb-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Seamless Booking</p>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Select an available time slot above to schedule your meeting with <span className="font-semibold text-primary">{username}</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer with branding */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-4 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Powered by <span className="font-medium text-primary">BookingBlitz</span> • Simple scheduling ahead
        </div>
      </footer>
      
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
