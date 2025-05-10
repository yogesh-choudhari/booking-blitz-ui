
import React from 'react';
import { TimeSlot } from '@/types/calendar';
import { parseISO, format } from 'date-fns';

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
      <div className="py-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (availableSlots.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No availability on this date.</p>
        <p className="text-gray-500 text-sm mt-2">Please select another date.</p>
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
    <div>
      <h2 className="text-lg font-semibold mb-4">Available Times</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {availableSlots.map((slot) => (
          <button
            key={slot.start}
            onClick={() => onSelectTimeSlot(slot)}
            className="p-3 border border-gray-200 rounded-md hover:border-blue-300 hover:bg-blue-50 hover:scale-105 transition-all text-center"
          >
            {formatTimeDisplay(slot.time)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeSlotGrid;
