import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState, useEffect } from "react";

const timeOptions = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", 
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"
];

interface ScheduleConfig {
  enabled: boolean;
  morningEnabled: boolean;
  morningFrom: string;
  morningTo: string;
  afternoonEnabled: boolean;
  afternoonFrom: string;
  afternoonTo: string;
}

interface PrestationScheduleConfigProps {
  selectedDates: Date[];
  onChange?: (schedules: { [dateKey: string]: ScheduleConfig }) => void;
}

export const PrestationScheduleConfig = ({ selectedDates, onChange }: PrestationScheduleConfigProps) => {
  const [schedules, setSchedules] = useState<{ [dateKey: string]: ScheduleConfig }>({});

  // Group dates by day of week
  const groupedDates = selectedDates.reduce((acc, date) => {
    const dayName = format(date, "EEEE", { locale: fr });
    if (!acc[dayName]) {
      acc[dayName] = [];
    }
    acc[dayName].push(date);
    return acc;
  }, {} as { [dayName: string]: Date[] });

  const uniqueDays = Object.keys(groupedDates).sort((a, b) => {
    const daysOrder = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
    return daysOrder.indexOf(a.toLowerCase()) - daysOrder.indexOf(b.toLowerCase());
  });

  useEffect(() => {
    if (onChange) {
      onChange(schedules);
    }
  }, [schedules]);

  const handleDayToggle = (dayName: string) => {
    setSchedules(prev => ({
      ...prev,
      [dayName]: {
        enabled: !prev[dayName]?.enabled,
        morningEnabled: prev[dayName]?.morningEnabled || false,
        morningFrom: prev[dayName]?.morningFrom || "",
        morningTo: prev[dayName]?.morningTo || "",
        afternoonEnabled: prev[dayName]?.afternoonEnabled || false,
        afternoonFrom: prev[dayName]?.afternoonFrom || "",
        afternoonTo: prev[dayName]?.afternoonTo || "",
      }
    }));
  };

  const handlePeriodToggle = (dayName: string, period: 'morning' | 'afternoon') => {
    setSchedules(prev => ({
      ...prev,
      [dayName]: {
        ...prev[dayName],
        enabled: true,
        morningEnabled: period === 'morning' ? !prev[dayName]?.morningEnabled : (prev[dayName]?.morningEnabled || false),
        morningFrom: prev[dayName]?.morningFrom || "",
        morningTo: prev[dayName]?.morningTo || "",
        afternoonEnabled: period === 'afternoon' ? !prev[dayName]?.afternoonEnabled : (prev[dayName]?.afternoonEnabled || false),
        afternoonFrom: prev[dayName]?.afternoonFrom || "",
        afternoonTo: prev[dayName]?.afternoonTo || "",
      }
    }));
  };

  const handleTimeChange = (dayName: string, field: string, value: string) => {
    setSchedules(prev => ({
      ...prev,
      [dayName]: {
        ...prev[dayName],
        enabled: prev[dayName]?.enabled || false,
        [field]: value
      }
    }));
  };

  if (uniqueDays.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        Aucune date sélectionnée. Veuillez sélectionner des dates dans le calendrier ci-dessus.
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      <div className="text-sm font-medium mb-3">Configuration des horaires</div>
      
      <div className="grid grid-cols-7 gap-4 mb-2 text-center font-medium text-xs">
        <div></div>
        <div></div>
        <div className="col-span-2">Matin</div>
        <div></div>
        <div className="col-span-2">Après-midi</div>
      </div>
      
      <div className="grid grid-cols-7 gap-2 mb-3 text-center text-xs text-muted-foreground">
        <div></div>
        <div></div>
        <div>de</div>
        <div>à</div>
        <div></div>
        <div>de</div>
        <div>à</div>
      </div>
      
      {uniqueDays.map((dayName) => {
        const dateCount = groupedDates[dayName].length;
        return (
          <div key={dayName} className="grid grid-cols-7 gap-2 items-center">
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id={`schedule-${dayName}`}
                  checked={schedules[dayName]?.enabled || false}
                  onCheckedChange={() => handleDayToggle(dayName)}
                />
                <label 
                  htmlFor={`schedule-${dayName}`} 
                  className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {dayName}
                </label>
              </div>
              <span className="text-xs text-muted-foreground ml-6">
                ({dateCount} date{dateCount > 1 ? 's' : ''})
              </span>
            </div>
            
            <div className="flex items-center justify-center">
              <Checkbox 
                id={`${dayName}-morning`}
                checked={schedules[dayName]?.morningEnabled || false}
                onCheckedChange={() => handlePeriodToggle(dayName, 'morning')}
                disabled={!schedules[dayName]?.enabled}
              />
            </div>
            
            {schedules[dayName]?.enabled && schedules[dayName]?.morningEnabled ? (
              <>
                <Select
                  value={schedules[dayName]?.morningFrom || ""}
                  onValueChange={(value) => handleTimeChange(dayName, 'morningFrom', value)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="08:00" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {timeOptions.slice(0, 11).map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select
                  value={schedules[dayName]?.morningTo || ""}
                  onValueChange={(value) => handleTimeChange(dayName, 'morningTo', value)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="13:00" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {timeOptions.slice(0, 11).map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            ) : (
              <div className="col-span-2"></div>
            )}
            
            <div className="flex items-center justify-center">
              <Checkbox 
                id={`${dayName}-afternoon`}
                checked={schedules[dayName]?.afternoonEnabled || false}
                onCheckedChange={() => handlePeriodToggle(dayName, 'afternoon')}
                disabled={!schedules[dayName]?.enabled}
              />
            </div>
            
            {schedules[dayName]?.enabled && schedules[dayName]?.afternoonEnabled ? (
              <>
                <Select
                  value={schedules[dayName]?.afternoonFrom || ""}
                  onValueChange={(value) => handleTimeChange(dayName, 'afternoonFrom', value)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="13:00" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {timeOptions.slice(10).map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select
                  value={schedules[dayName]?.afternoonTo || ""}
                  onValueChange={(value) => handleTimeChange(dayName, 'afternoonTo', value)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="20:00" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {timeOptions.slice(10).map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            ) : (
              <div className="col-span-2"></div>
            )}
          </div>
        );
      })}
    </div>
  );
};
