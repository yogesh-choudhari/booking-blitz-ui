
import React, { useState } from 'react';
import { TimeSlot } from '@/types/calendar';
import { format } from 'date-fns';
import { Clock, Calendar, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  if (isLoading) {
    return (
      <div className="py-12 flex flex-col items-center bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="w-full h-1 bg-gradient-to-r from-blue-300 via-primary to-purple-400 mb-8"></div>
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
      <div className="text-center py-12 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-md overflow-hidden">
        <div className="w-full h-1 bg-gradient-to-r from-blue-300 via-primary to-purple-400 mb-8"></div>
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

  // Group time slots by time of day (morning, afternoon, evening)
  const groupedSlots: { [key: string]: TimeSlot[] } = availableSlots.reduce((acc, slot) => {
    const hour = parseInt(slot.time.split(':')[0], 10);
    let timeOfDay = 'Morning';
    
    if (hour >= 12 && hour < 17) {
      timeOfDay = 'Afternoon';
    } else if (hour >= 17) {
      timeOfDay = 'Evening';
    }
    
    if (!acc[timeOfDay]) {
      acc[timeOfDay] = [];
    }
    
    acc[timeOfDay].push(slot);
    return acc;
  }, {} as { [key: string]: TimeSlot[] });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-md overflow-hidden">
      <div className="w-full h-1 bg-gradient-to-r from-blue-300 via-primary to-purple-400 -mt-6 mb-6"></div>
      
      {Object.entries(groupedSlots).map(([timeOfDay, slots]) => (
        <div key={timeOfDay} className="mb-6 last:mb-0">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 ml-1">
            {timeOfDay}
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {slots.map((slot, index) => {
              const isHovered = hoveredIndex === index;
              
              return (
                <button
                  key={slot.start}
                  onClick={() => onSelectTimeSlot(slot)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={cn(
                    "group relative py-4 px-1 border rounded-lg overflow-hidden transition-all duration-200",
                    isHovered 
                      ? "border-primary shadow-sm dark:border-primary" 
                      : "border-gray-200 dark:border-gray-700"
                  )}
                >
                  <div 
                    className={cn(
                      "absolute inset-0 transform transition-transform duration-300",
                      isHovered 
                        ? "bg-primary/10 dark:bg-primary/20 scale-y-100" 
                        : "bg-primary/5 dark:bg-primary/10 scale-y-0"
                    )}
                    style={{ 
                      transformOrigin: isHovered ? 'top' : 'bottom' 
                    }}
                  />
                  
                  <div className="relative flex flex-col items-center">
                    <div className="mb-1 h-4 w-4 flex items-center justify-center">
                      {isHovered ? (
                        <Check className="h-4 w-4 text-primary transform scale-110 transition-all" />
                      ) : (
                        <Clock className="h-4 w-4 text-primary transition-all" />
                      )}
                    </div>
                    
                    <span className={cn(
                      "font-medium transition-colors", 
                      isHovered
                        ? "text-primary" 
                        : "text-gray-800 dark:text-gray-200"
                    )}>
                      {formatTimeDisplay(slot.time)}
                    </span>
                    
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {slot.duration} min
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimeSlotGrid;
