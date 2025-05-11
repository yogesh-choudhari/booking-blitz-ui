
import React, { useState } from 'react';
import { TimeSlot } from '@/types/calendar';
import { format } from 'date-fns';
import { Clock, Calendar, Check, CheckCircle, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const isMobile = useIsMobile();
  
  if (isLoading) {
    return (
      <div className="py-12 flex flex-col items-center bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="w-full h-1 bg-gradient-to-r from-blue-400 via-primary to-purple-500 mb-8"></div>
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-primary animate-spin"></div>
          <Clock className="h-10 w-10 absolute inset-0 m-auto text-primary/70" />
        </div>
        <p className="text-base text-gray-500 dark:text-gray-400 mt-6 font-medium">Loading available times...</p>
        <div className="flex items-center space-x-2 mt-3">
          <div className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse"></div>
          <div className="h-1.5 w-1.5 bg-primary/70 rounded-full animate-pulse delay-150"></div>
          <div className="h-1.5 w-1.5 bg-primary/50 rounded-full animate-pulse delay-300"></div>
        </div>
      </div>
    );
  }

  if (availableSlots.length === 0) {
    return (
      <div className="text-center py-16 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="w-full h-1 bg-gradient-to-r from-blue-400 via-primary to-purple-500 mb-10"></div>
        <div className="bg-gray-50 dark:bg-gray-700/30 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <CalendarIcon className="h-12 w-12 text-gray-400 dark:text-gray-300" />
        </div>
        <h3 className="text-gray-800 dark:text-gray-200 font-medium text-xl mb-3">No availability on this date</h3>
        <p className="text-gray-500 dark:text-gray-400 text-base max-w-sm mx-auto mb-6">Please select another date or check back later for new openings.</p>
        <div className="flex justify-center">
          <span className="px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-full text-sm text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
            Try selecting another date from the calendar
          </span>
        </div>
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

  const handleSelectSlot = (slot: TimeSlot, index: number) => {
    setSelectedIndex(index);
    onSelectTimeSlot(slot);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm overflow-hidden">
      <div className="w-full h-1 bg-gradient-to-r from-blue-400 via-primary to-purple-500 -mt-6 mb-8"></div>
      
      {Object.entries(groupedSlots).map(([timeOfDay, slots]) => (
        <div key={timeOfDay} className="mb-8 last:mb-0">
          <div className="flex items-center mb-4">
            <div className="flex items-center px-3 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-full">
              <span className={cn(
                "h-2 w-2 rounded-full mr-2",
                timeOfDay === 'Morning' ? "bg-yellow-400" : 
                timeOfDay === 'Afternoon' ? "bg-green-400" : "bg-blue-400"
              )}></span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{timeOfDay}</span>
            </div>
          </div>
          
          <div className={cn(
            "grid gap-3",
            isMobile ? "grid-cols-2" : 
            "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
          )}>
            {slots.map((slot, index) => {
              const globalIndex = availableSlots.indexOf(slot);
              const isHovered = hoveredIndex === globalIndex;
              const isSelected = selectedIndex === globalIndex;
              
              return (
                <button
                  key={slot.start}
                  onClick={() => handleSelectSlot(slot, globalIndex)}
                  onMouseEnter={() => setHoveredIndex(globalIndex)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={cn(
                    "group relative py-5 px-3 border rounded-xl overflow-hidden transition-all duration-200",
                    isSelected 
                      ? "border-primary shadow-sm bg-primary/5 dark:bg-primary/10" 
                      : isHovered
                        ? "border-gray-300 dark:border-gray-600 shadow-sm"
                        : "border-gray-200 dark:border-gray-700"
                  )}
                >
                  <div 
                    className={cn(
                      "absolute inset-0 transform transition-transform duration-300",
                      isSelected 
                        ? "bg-primary/10 dark:bg-primary/20 scale-y-100" 
                        : isHovered 
                          ? "bg-gray-50 dark:bg-gray-800/70 scale-y-100" 
                          : "bg-transparent scale-y-0"
                    )}
                    style={{ 
                      transformOrigin: 'top'
                    }}
                  />
                  
                  <div className="relative flex flex-col items-center">
                    <div className="mb-2 h-6 w-6 flex items-center justify-center">
                      {isSelected ? (
                        <CheckCircle className="h-6 w-6 text-primary transform scale-110 transition-all" />
                      ) : isHovered ? (
                        <Check className="h-5 w-5 text-primary transform scale-110 transition-all" />
                      ) : (
                        <Clock className="h-5 w-5 text-primary/70 transition-all" />
                      )}
                    </div>
                    
                    <span className={cn(
                      "font-medium text-lg transition-colors", 
                      isSelected || isHovered
                        ? "text-primary" 
                        : "text-gray-800 dark:text-gray-200"
                    )}>
                      {formatTimeDisplay(slot.time)}
                    </span>
                    
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {slot.duration} min
                    </span>
                  </div>

                  {isSelected && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary"></div>
                  )}
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
