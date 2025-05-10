
import React from 'react';
import { useForm } from 'react-hook-form';
import { TimeSlot, BookingFormInputs } from '@/types/calendar';
import { format } from 'date-fns';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Mail, MessageSquare } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BookingFormInputs) => void;
  selectedSlot: TimeSlot | null;
  isSubmitting: boolean;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  selectedSlot,
  isSubmitting
}) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<BookingFormInputs>();

  if (!selectedSlot) return null;

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
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Complete your booking</h2>
            <p className="text-sm text-gray-500 mt-1">Enter your details to confirm the appointment.</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg space-y-3 border border-gray-100">
            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Date</p>
                <p className="font-medium text-gray-800">
                  {format(new Date(selectedSlot.date), 'EEEE, MMMM d, yyyy')}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Time</p>
                <p className="font-medium text-gray-800">
                  {formatTime(selectedSlot.time)} ({selectedSlot.duration} minutes)
                </p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <div className="flex items-center mb-1.5">
                <User className="h-4 w-4 text-gray-500 mr-2" />
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Your Name *
                </label>
              </div>
              <input
                id="name"
                type="text"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="John Doe"
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            
            <div>
              <div className="flex items-center mb-1.5">
                <Mail className="h-4 w-4 text-gray-500 mr-2" />
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
              </div>
              <input
                id="email"
                type="email"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="john@example.com"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <div className="flex items-center mb-1.5">
                <MessageSquare className="h-4 w-4 text-gray-500 mr-2" />
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Additional Notes (Optional)
                </label>
              </div>
              <textarea
                id="notes"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Share anything that will help prepare for our meeting..."
                {...register('notes')}
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="border-gray-300"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <span className="mr-2">Booking</span>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  'Confirm'
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
