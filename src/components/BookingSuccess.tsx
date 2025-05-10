
import React from 'react';
import { Booking } from '@/types/calendar';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Calendar, CheckCircle, Clock, Video, ArrowRight } from 'lucide-react';

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
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center text-center space-y-5 py-4">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Booking confirmed</h2>
            <p className="text-sm text-gray-500 mt-1">You're all set! The meeting has been scheduled.</p>
          </div>
          
          <div className="w-full bg-gray-50 rounded-lg p-5 space-y-4 border border-gray-100">
            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-gray-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-left">
                <p className="text-xs text-gray-500 mb-0.5">Date</p>
                <p className="font-medium text-gray-800">
                  {format(new Date(booking.date), 'EEEE, MMMM d, yyyy')}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-gray-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-left">
                <p className="text-xs text-gray-500 mb-0.5">Time</p>
                <p className="font-medium text-gray-800">
                  {formatTime(booking.start_time)} ({booking.duration} minutes)
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Video className="h-5 w-5 text-gray-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-left">
                <p className="text-xs text-gray-500 mb-0.5">Meeting Platform</p>
                <p className="font-medium text-gray-800 capitalize">{booking.platform}</p>
                
                {booking.meeting_link && (
                  <a 
                    href={booking.meeting_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm mt-1 inline-flex items-center"
                  >
                    Join {booking.platform} meeting
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
          
          <div className="w-full pt-4">
            <Button onClick={onClose} className="w-full">
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingSuccess;
