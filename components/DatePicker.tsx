import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date | null) => void;
  isDateAvailable?: (date: Date) => boolean;
}

export const DatePicker = ({ selectedDate, onDateSelect, isDateAvailable }: DatePickerProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const selectedButtonRef = useRef<HTMLButtonElement>(null);

  // Force white text on selected date after any re-render
  useEffect(() => {
    if (selectedButtonRef.current && selectedDate) {
      selectedButtonRef.current.style.color = 'white';
      selectedButtonRef.current.style.setProperty('color', 'white', 'important');
    }
  }, [selectedDate, currentMonth, currentYear]);

  // Debug logs pour le composant DatePicker
  console.log("=== DATEPICKER DEBUG ===");
  console.log("DatePicker props selectedDate:", selectedDate);
  console.log("DatePicker selectedDate is null:", selectedDate === null);
  if (selectedDate) {
    console.log("DatePicker selectedDate day:", selectedDate.getDate());
    console.log("DatePicker selectedDate month:", selectedDate.getMonth());
  }
  console.log("=========================")

  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Adjust for Monday as first day
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Don't allow selection of past dates
    if (clickedDate < today) return;
    
    // Toggle selection - if same date clicked, deselect
    if (selectedDate && 
        selectedDate.getDate() === day && 
        selectedDate.getMonth() === currentMonth && 
        selectedDate.getFullYear() === currentYear) {
      onDateSelect(null);
    } else {
      onDateSelect(clickedDate);
    }
  };

  const isSelected = (day: number) => {
    return selectedDate &&
           selectedDate.getDate() === day &&
           selectedDate.getMonth() === currentMonth &&
           selectedDate.getFullYear() === currentYear;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day &&
           today.getMonth() === currentMonth &&
           today.getFullYear() === currentYear;
  };

  const isPastDate = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 w-12"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelectedDay = isSelected(day);
      const isTodayDay = isToday(day);
      const isPast = isPastDate(day);
      const currentDate = new Date(currentYear, currentMonth, day);
      const isAvailable = isDateAvailable ? isDateAvailable(currentDate) : true;
      const isDisabled = isPast || !isAvailable;

      days.push(
        <button
          key={day}
          ref={isSelectedDay ? selectedButtonRef : null}
          onClick={() => handleDateClick(day)}
          disabled={isDisabled}
          className={cn(
            "h-12 w-12 text-center text-base p-0 rounded-md flex items-center justify-center",
            isDisabled && "text-muted-foreground opacity-50 cursor-not-allowed",
            // Only show "today" highlight when no date is selected
            isTodayDay && !isSelectedDay && !selectedDate && !isDisabled && "bg-accent text-accent-foreground",
            !isDisabled && !isSelectedDay && !isTodayDay && "hover:bg-gray-100 hover:text-accent-foreground transition-colors"
          )}
          style={
            isSelectedDay 
              ? { 
                  backgroundColor: '#3A7E53 !important', 
                  color: 'white !important',
                } as any
              : {}
          }
          onFocus={(e) => {
            if (isSelectedDay) {
              (e.target as HTMLButtonElement).style.setProperty('color', 'white', 'important');
            }
          }}
          onBlur={(e) => {
            if (isSelectedDay) {
              (e.target as HTMLButtonElement).style.setProperty('color', 'white', 'important');
            }
          }}
          onMouseEnter={(e) => {
            if (isSelectedDay) {
              (e.target as HTMLButtonElement).style.setProperty('color', 'white', 'important');
            }
          }}
          onMouseLeave={(e) => {
            if (isSelectedDay) {
              (e.target as HTMLButtonElement).style.setProperty('color', 'white', 'important');
            }
          }}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex justify-center items-center mb-6 relative">
        <button
          onClick={handlePreviousMonth}
          className="absolute left-0 h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        <h2 className="text-lg font-medium">
          {months[currentMonth]} {currentYear}
        </h2>
        
        <button
          onClick={handleNextMonth}
          className="absolute right-0 h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Week days */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="h-8 flex items-center justify-center text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {renderCalendar()}
      </div>
    </Card>
  );
};