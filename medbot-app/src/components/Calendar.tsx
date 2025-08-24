import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CalendarProps {
  year: number;
  month: number;
  onDateClick?: (date: Date) => void;
  selectedDates?: Date[];
  highlightedDates?: Date[];
}

const Calendar: React.FC<CalendarProps> = ({ 
  year, 
  month, 
  onDateClick,
  selectedDates = [],
  highlightedDates = []
}) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const isDateSelected = (date: Date) => {
    return selectedDates.some(selectedDate => 
      selectedDate.toDateString() === date.toDateString()
    );
  };

  const isDateHighlighted = (date: Date) => {
    return highlightedDates.some(highlightedDate => 
      highlightedDate.toDateString() === date.toDateString()
    );
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const isToday = new Date().toDateString() === currentDate.toDateString();
      const isSelected = isDateSelected(currentDate);
      const isHighlighted = isDateHighlighted(currentDate);
      
      // Sample highlighted dates based on the image pattern
      const sampleHighlighted = [4, 11, 18, 25, 26].includes(day) || 
                               (month === 1 && [1, 8, 15, 22].includes(day)) ||
                               (month === 2 && [1, 8, 15, 22, 28, 29].includes(day)) ||
                               (month === 3 && [1, 8, 15, 22, 29, 30, 31].includes(day)) ||
                               (month === 4 && [5, 12, 19, 26].includes(day)) ||
                               (month === 5 && [3, 10, 17, 24, 31].includes(day)) ||
                               (month === 6 && [7, 14, 21, 28].includes(day)) ||
                               (month === 7 && [5, 12, 19, 26].includes(day)) ||
                               (month === 8 && [2, 9, 16, 23, 30].includes(day)) ||
                               (month === 9 && [6, 13, 20, 27].includes(day)) ||
                               (month === 10 && [4, 11, 18, 25].includes(day)) ||
                               (month === 11 && [1, 8, 15, 22, 29].includes(day)) ||
                               (month === 11 && [6, 13, 20, 27].includes(day));
      
      const shouldHighlight = isHighlighted || sampleHighlighted;
      
      days.push(
        <button
          key={day}
          onClick={() => onDateClick?.(currentDate)}
          className={`
            h-8 w-8 text-sm rounded flex items-center justify-center transition-colors
            ${isToday ? 'bg-primary text-primary-foreground font-bold' : ''}
            ${shouldHighlight && !isToday ? 'bg-gray-800 text-white' : ''}
            ${isSelected && !isToday ? 'bg-accent text-accent-foreground' : ''}
            ${!isToday && !shouldHighlight && !isSelected ? 'hover:bg-muted text-foreground' : ''}
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-2xl p-4 w-full max-w-sm border border-gray-200 shadow-sm">
      {/* Month Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 text-lg">{monthNames[month]}</h3>
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 hover:bg-gray-100"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 hover:bg-gray-100"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div 
            key={day} 
            className="h-8 flex items-center justify-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default Calendar; 