
import React from 'react';
import { format, addDays, isSameDay, isToday } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 shadow-md">
      <div className="flex items-center justify-between mb-5">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 border-gray-200 dark:border-gray-700 flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-primary" />
              <span>Full Calendar</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && onDateChange(date)}
              initialFocus
              className="pointer-events-auto border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 gap-3">
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
              className={`flex items-center p-3 rounded-lg transition-all ${
                isSelected
                  ? 'bg-primary/10 dark:bg-primary/20 border border-primary text-primary'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-gray-100 dark:border-gray-700'
              }`}
            >
              <div className={`flex items-center justify-center rounded-md h-12 w-12 ${
                isSelected 
                  ? 'bg-primary/20 dark:bg-primary/30'
                  : todayFlag ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-gray-800'
              }`}>
                <span className="text-lg font-semibold">
                  {dayOfMonth}
                </span>
              </div>
              
              <div className="ml-4 text-left">
                <p className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-gray-900 dark:text-gray-100'}`}>
                  {dayName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {monthName} {format(date, 'yyyy')}
                </p>
              </div>
              
              {todayFlag && (
                <span className="ml-auto text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                  Today
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DateSelector;
