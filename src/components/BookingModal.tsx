
import React from 'react';
import { useForm } from 'react-hook-form';
import { TimeSlot, BookingFormInputs } from '@/types/calendar';
import { format } from 'date-fns';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <h2 className="text-xl font-bold mb-4">Complete your booking</h2>
          
          <div className="mb-6 p-3 bg-gray-50 rounded-md">
            <div className="text-sm text-gray-500">Selected time</div>
            <div className="font-medium">
              {format(new Date(selectedSlot.date), 'EEEE, MMMM d, yyyy')}
            </div>
            <div className="font-medium">
              {formatTime(selectedSlot.time)} ({selectedSlot.duration} minutes)
            </div>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name *
              </label>
              <input
                id="name"
                type="text"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
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
            
            <div className="mb-6">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register('notes')}
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2">Booking...</span>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default BookingModal;
