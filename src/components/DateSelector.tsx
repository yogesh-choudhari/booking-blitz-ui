
import React from 'react';
import { format, addDays, isSameDay, isToday, isBefore } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onDateChange }) => {
  const today = new Date();
  const dateOptions = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  // Function to scroll to next week
  const getNextWeek = () => {
    return dateOptions.map(date => addDays(date, 7));
  };

  // Function to check if a date is in the past
  const isPastDate = (date: Date) => {
    return isBefore(date, today) && !isToday(date);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
      {/* Calendar Popup */}
      <div className="flex items-center justify-between mb-6">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 border-gray-200 dark:border-gray-700 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700">
              <CalendarIcon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Full Calendar</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && onDateChange(date)}
              initialFocus
              disabled={(date) => isPastDate(date)}
              className="border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm"
            />
          </PopoverContent>
        </Popover>
        
        <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {format(today, 'MMMM yyyy')}
        </div>
      </div>

      {/* Date Pills */}
      <div className="space-y-3">
        {dateOptions.map((date) => {
          const isSelected = isSameDay(date, selectedDate);
          const dayOfMonth = format(date, 'd');
          const dayName = format(date, 'EEE');
          const monthName = format(date, 'MMM');
          const todayFlag = isToday(date);
          
          return (
            <button
              key={date.toISOString()}
              onClick={() => onDateChange(date)}
              className={cn(
                "flex items-center w-full p-3.5 rounded-lg transition-all duration-200", 
                isSelected
                  ? "bg-primary/10 dark:bg-primary/20 border border-primary shadow-sm"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
              )}
            >
              <div className={cn(
                "flex items-center justify-center rounded-md h-12 w-12 transition-all", 
                isSelected 
                  ? "bg-primary/20 dark:bg-primary/30 text-primary"
                  : todayFlag 
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
                    : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              )}>
                <span className="text-lg font-semibold">
                  {dayOfMonth}
                </span>
              </div>
              
              <div className="ml-4 text-left flex-1">
                <p className={cn(
                  "text-sm font-medium", 
                  isSelected 
                    ? "text-primary" 
                    : "text-gray-900 dark:text-gray-100"
                )}>
                  {dayName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {monthName} {format(date, 'yyyy')}
                </p>
              </div>
              
              <div className="ml-auto">
                {todayFlag && (
                  <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                    Today
                  </span>
                )}
                {isSelected && !todayFlag && (
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Navigation controls */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
        <Button 
          variant="ghost" 
          size="sm"
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          disabled={true} // Disabled for now as we start from today
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          onClick={() => {
            // Implementation for next week would go here
            // This is a placeholder for now
          }}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

// Helper function to conditionally join class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export default DateSelector;
