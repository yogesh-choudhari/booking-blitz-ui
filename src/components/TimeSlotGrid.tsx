
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
      <div className="py-12 flex flex-col items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading available times...</p>
      </div>
    );
  }

  if (availableSlots.length === 0) {
    return (
      <div className="text-center py-12 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
        <Calendar className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
        <p className="text-gray-600 dark:text-gray-300 font-medium mb-2">No availability on this date</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Please select another date or check back later.</p>
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
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Available times</h2>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
        {availableSlots.map((slot) => (
          <button
            key={slot.start}
            onClick={() => onSelectTimeSlot(slot)}
            className="py-3 px-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary dark:hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 dark:focus:ring-offset-gray-800 transition-all text-center"
          >
            <span className="font-medium text-gray-800 dark:text-gray-200">{formatTimeDisplay(slot.time)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeSlotGrid;
