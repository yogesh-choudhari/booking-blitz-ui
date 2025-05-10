
import React from 'react';
import { format, addDays, isSameDay } from 'date-fns';

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onDateChange }) => {
  const today = new Date();
  const dateOptions = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">Select a Date</h2>
      <div className="flex overflow-x-auto space-x-2 pb-2">
        {dateOptions.map((date) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);
          
          return (
            <button
              key={date.toISOString()}
              onClick={() => onDateChange(date)}
              className={`min-w-[100px] p-4 rounded-md text-center transition-all ${
                isSelected
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white border border-gray-200 hover:border-blue-300 hover:scale-105'
              }`}
            >
              <div className="font-medium">{format(date, 'EEE')}</div>
              <div className={`text-xl font-bold ${isToday && !isSelected ? 'text-blue-500' : ''}`}>
                {format(date, 'd')}
              </div>
              <div className="text-sm">{format(date, 'MMM')}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DateSelector;
