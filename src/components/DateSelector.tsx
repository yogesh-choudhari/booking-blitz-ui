
import React from 'react';
import { format, addDays, isSameDay } from 'date-fns';
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
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Select a date</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto h-8 border-gray-200">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>Calendar</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && onDateChange(date)}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-7 gap-1.5 pb-1">
        {dateOptions.map((date) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);
          const dayOfMonth = format(date, 'd');
          const dayName = format(date, 'EEE');
          
          return (
            <button
              key={date.toISOString()}
              onClick={() => onDateChange(date)}
              className={`flex flex-col items-center rounded-lg py-3 hover:bg-gray-50 transition-colors ${
                isSelected
                  ? 'bg-gray-50 border-2 border-primary text-primary font-semibold'
                  : 'border border-gray-100'
              }`}
            >
              <span className={`text-xs mb-1 ${isSelected ? 'text-primary' : 'text-gray-500'}`}>
                {dayName}
              </span>
              <span className={`text-xl ${isToday ? 'font-bold' : ''} ${isSelected ? 'text-primary' : 'text-gray-800'}`}>
                {dayOfMonth}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DateSelector;
