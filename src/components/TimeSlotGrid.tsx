
import React from 'react';
import { TimeSlot } from '@/types/calendar';
import { format } from 'date-fns';
import { Clock, Calendar } from 'lucide-react';

interface TimeSlotGridProps {
  availableSlots: TimeSlot[];
  onSelectTimeSlot: (slot: TimeSlot) => void;
  isLoading: boolean;
}

const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({ 
  availableSlots, 
  onSelectTimeSlot, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="py-12 flex flex-col items-center bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-primary animate-spin"></div>
          <Clock className="h-8 w-8 absolute inset-0 m-auto text-primary/70" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 font-medium">Loading available times...</p>
      </div>
    );
  }

  if (availableSlots.length === 0) {
    return (
      <div className="text-center py-12 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-md">
        <div className="bg-gray-50 dark:bg-gray-700/30 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="h-10 w-10 text-gray-400 dark:text-gray-300" />
        </div>
        <h3 className="text-gray-800 dark:text-gray-200 font-medium text-lg mb-2">No availability on this date</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto">Please select another date or check back later for new openings.</p>
      </div>
    );
  }

  // Format time from "09:00" to "9:00 AM"
  const formatTimeDisplay = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const parsedTime = new Date();
    parsedTime.setHours(parseInt(hours, 10));
    parsedTime.setMinutes(parseInt(minutes, 10));
    return format(parsedTime, 'h:mm a');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-md">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {availableSlots.map((slot) => (
          <button
            key={slot.start}
            onClick={() => onSelectTimeSlot(slot)}
            className="group relative py-4 px-1 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary dark:hover:border-primary overflow-hidden transition-all duration-200"
          >
            <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom"></div>
            <div className="relative flex flex-col items-center">
              <Clock className="h-4 w-4 text-primary mb-1 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-primary dark:group-hover:text-primary transition-colors">
                {formatTimeDisplay(slot.time)}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {slot.duration} min
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeSlotGrid;
