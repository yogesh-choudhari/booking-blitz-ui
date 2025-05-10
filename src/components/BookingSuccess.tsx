
import React from 'react';
import { Booking } from '@/types/calendar';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface BookingSuccessProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
}

const BookingSuccess: React.FC<BookingSuccessProps> = ({ isOpen, onClose, booking }) => {
  if (!booking) return null;

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return format(date, 'h:mm a');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-xl font-bold mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">Your meeting has been successfully scheduled.</p>
          
          <div className="mb-6 p-4 bg-gray-50 rounded-md text-left">
            <div className="mb-3">
              <div className="text-sm text-gray-500">Date & Time</div>
              <div className="font-medium">
                {format(new Date(booking.date), 'EEEE, MMMM d, yyyy')}
              </div>
              <div className="font-medium">
                {formatTime(booking.start_time)} ({booking.duration} minutes)
              </div>
            </div>
            
            <div className="mb-3">
              <div className="text-sm text-gray-500">Meeting Platform</div>
              <div className="font-medium capitalize">{booking.platform}</div>
            </div>
            
            {booking.meeting_link && (
              <div>
                <div className="text-sm text-gray-500">Meeting Link</div>
                <a 
                  href={booking.meeting_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium break-all"
                >
                  {booking.meeting_link}
                </a>
              </div>
            )}
          </div>
          
          <div className="flex justify-center">
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default BookingSuccess;
