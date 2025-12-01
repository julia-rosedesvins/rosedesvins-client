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
  existingAvailability?: any[]; // Array of dateAvailability from API
}

export const PrestationScheduleConfig = ({ selectedDates, onChange, existingAvailability }: PrestationScheduleConfigProps) => {
  const [schedules, setSchedules] = useState<{ [dayOfWeek: string]: ScheduleConfig }>({});

  // Initialize schedules from existing availability data
  useEffect(() => {
    if (existingAvailability && existingAvailability.length > 0) {
      console.log('PrestationScheduleConfig existingAvailability:', existingAvailability);
      const initialSchedules: { [dayOfWeek: string]: ScheduleConfig } = {};

      existingAvailability.forEach((availability: any) => {
        // Validate and parse the date
        if (!availability.date) {
          console.warn('Availability item missing date:', availability);
          return;
        }

        const date = new Date(availability.date);

        // Check if date is valid
        if (isNaN(date.getTime())) {
          console.warn('Invalid date in availability:', availability.date, availability);
          return;
        }

        // Use day of week as key (0 = Sunday, 1 = Monday, etc.)
        const dayOfWeek = date.getDay().toString();

        console.log(`Processing date ${availability.date} (day ${dayOfWeek}):`, {
          availability,
          morningEnabled: Boolean(availability.morningEnabled),
          afternoonEnabled: Boolean(availability.afternoonEnabled)
        });

        // Group by day of week - use first occurrence's settings
        if (!initialSchedules[dayOfWeek]) {
          initialSchedules[dayOfWeek] = {
            enabled: Boolean(availability.enabled),
            morningEnabled: Boolean(availability.morningEnabled),
            morningFrom: availability.morningFrom || '',
            morningTo: availability.morningTo || '',
            afternoonEnabled: Boolean(availability.afternoonEnabled),
            afternoonFrom: availability.afternoonFrom || '',
            afternoonTo: availability.afternoonTo || ''
          };
        }
      });

      console.log('Setting schedules from API data (grouped by day):', initialSchedules);
      setSchedules(initialSchedules);
    }
  }, [JSON.stringify(existingAvailability)]); // Use JSON.stringify to properly detect changes

  // Group dates by day of week
  const groupedByDayOfWeek = selectedDates.reduce((acc, date) => {
    const dayOfWeek = date.getDay();
    if (!acc[dayOfWeek]) {
      acc[dayOfWeek] = [];
    }
    acc[dayOfWeek].push(date);
    return acc;
  }, {} as { [key: number]: Date[] });

  // Create list of unique days with their info
  const uniqueDays = Object.entries(groupedByDayOfWeek)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([dayOfWeek, dates]) => {
      const dayName = format(dates[0], "EEEE", { locale: fr });
      const dateList = dates
        .sort((a, b) => a.getTime() - b.getTime())
        .map(d => format(d, "dd/MM", { locale: fr }))
        .join(', ');
      return { dayOfWeek, dayName, dateList, dates };
    });

  // Initialize schedules for new days that don't have existing data
  useEffect(() => {
    setSchedules(prevSchedules => {
      const newSchedules = { ...prevSchedules };
      let hasChanges = false;

      uniqueDays.forEach(({ dayOfWeek }) => {
        if (!newSchedules[dayOfWeek]) {
          newSchedules[dayOfWeek] = {
            enabled: true,
            morningEnabled: false,
            morningFrom: '09:00',
            morningTo: '12:00',
            afternoonEnabled: false,
            afternoonFrom: '14:00',
            afternoonTo: '18:00'
          };
          hasChanges = true;
        }
      });

      return hasChanges ? newSchedules : prevSchedules;
    });
  }, [uniqueDays.map(d => d.dayOfWeek).join(',')]);

  useEffect(() => {
    if (onChange) {
      // Convert day-of-week schedules back to individual dates for API
      const dateSchedules: { [dateKey: string]: ScheduleConfig } = {};
      
      selectedDates.forEach(date => {
        const dayOfWeek = date.getDay().toString();
        const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        
        if (schedules[dayOfWeek]) {
          dateSchedules[dateKey] = schedules[dayOfWeek];
        }
      });
      
      onChange(dateSchedules);
    }
  }, [schedules, selectedDates]);

  const handleDateToggle = (dayOfWeek: string) => {
    setSchedules(prev => ({
      ...prev,
      [dayOfWeek]: {
        enabled: !prev[dayOfWeek]?.enabled,
        morningEnabled: prev[dayOfWeek]?.morningEnabled || false,
        morningFrom: prev[dayOfWeek]?.morningFrom || "",
        morningTo: prev[dayOfWeek]?.morningTo || "",
        afternoonEnabled: prev[dayOfWeek]?.afternoonEnabled || false,
        afternoonFrom: prev[dayOfWeek]?.afternoonFrom || "",
        afternoonTo: prev[dayOfWeek]?.afternoonTo || "",
      }
    }));
  };

  const handlePeriodToggle = (dayOfWeek: string, period: 'morning' | 'afternoon') => {
    setSchedules(prev => {
      const current = prev[dayOfWeek] || {} as any;
      const togglingMorning = period === 'morning';
      const nextMorningEnabled = togglingMorning ? !current.morningEnabled : (current.morningEnabled || false);
      const nextAfternoonEnabled = !togglingMorning ? !current.afternoonEnabled : (current.afternoonEnabled || false);

      return {
        ...prev,
        [dayOfWeek]: {
          ...current,
          enabled: true,
          // Ensure sensible defaults when enabling a period
          morningEnabled: nextMorningEnabled,
          morningFrom: nextMorningEnabled ? (current.morningFrom || '09:00') : (current.morningFrom || ''),
          morningTo: nextMorningEnabled ? (current.morningTo || '12:00') : (current.morningTo || ''),
          afternoonEnabled: nextAfternoonEnabled,
          afternoonFrom: nextAfternoonEnabled ? (current.afternoonFrom || '14:00') : (current.afternoonFrom || ''),
          afternoonTo: nextAfternoonEnabled ? (current.afternoonTo || '18:00') : (current.afternoonTo || ''),
        }
      };
    });
  };

  const handleTimeChange = (dayOfWeek: string, field: string, value: string) => {
    setSchedules(prev => ({
      ...prev,
      [dayOfWeek]: {
        ...prev[dayOfWeek],
        enabled: prev[dayOfWeek]?.enabled || false,
        [field]: value
      }
    }));
  };

  if (selectedDates.length === 0) {
    return (
      <div className="space-y-4 mt-4">
        <div className="text-sm text-muted-foreground">Sélectionnez des dates pour configurer les horaires de disponibilité</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      <div className="text-sm font-medium mb-3">Configuration des horaires par jour de la semaine</div>
      <div className="text-xs text-muted-foreground mb-3">
        Les horaires définis pour chaque jour s'appliqueront à toutes les dates sélectionnées de ce jour.
      </div>

      {/* Desktop headers */}
      <div className="hidden md:grid md:grid-cols-7 gap-4 mb-2 text-center font-medium text-xs">
        <div></div>
        <div></div>
        <div className="col-span-2">Matin</div>
        <div></div>
        <div className="col-span-2">Après-midi</div>
      </div>

      <div className="hidden md:grid md:grid-cols-7 gap-2 mb-3 text-center text-xs text-muted-foreground">
        <div></div>
        <div></div>
        <div>de</div>
        <div>à</div>
        <div></div>
        <div>de</div>
        <div>à</div>
      </div>

      {uniqueDays.map(({ dayOfWeek, dayName, dateList }) => {
        return (
          <div key={dayOfWeek}>
            {/* Mobile Layout */}
            <div className="md:hidden space-y-3 border rounded-lg p-3 bg-gray-50">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id={`schedule-${dayOfWeek}`}
                  checked={schedules[dayOfWeek]?.enabled || false}
                  onCheckedChange={() => handleDateToggle(dayOfWeek)}
                />
                <div className="flex-1">
                  <label
                    htmlFor={`schedule-${dayOfWeek}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {dayName}
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Dates: {dateList}
                  </p>
                </div>
              </div>

              {schedules[dayOfWeek]?.enabled && (
                <div className="space-y-3 ml-6">
                  {/* Morning Section - Mobile */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`${dayOfWeek}-morning-mobile`}
                        checked={schedules[dayOfWeek]?.morningEnabled || false}
                        onCheckedChange={() => handlePeriodToggle(dayOfWeek, 'morning')}
                      />
                      <span className="text-sm font-medium">Matin</span>
                    </div>
                    {schedules[dayOfWeek]?.morningEnabled && (
                      <div className="flex space-x-2 ml-6">
                        <div className="flex-1">
                          <label className="text-xs text-muted-foreground">De</label>
                          <Select
                            value={schedules[dayOfWeek]?.morningFrom || ""}
                            onValueChange={(value) => handleTimeChange(dayOfWeek, 'morningFrom', value)}
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
                        </div>
                        <div className="flex-1">
                          <label className="text-xs text-muted-foreground">À</label>
                          <Select
                            value={schedules[dayOfWeek]?.morningTo || ""}
                            onValueChange={(value) => handleTimeChange(dayOfWeek, 'morningTo', value)}
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
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Afternoon Section - Mobile */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`${dayOfWeek}-afternoon-mobile`}
                        checked={schedules[dayOfWeek]?.afternoonEnabled || false}
                        onCheckedChange={() => handlePeriodToggle(dayOfWeek, 'afternoon')}
                      />
                      <span className="text-sm font-medium">Après-midi</span>
                    </div>
                    {schedules[dayOfWeek]?.afternoonEnabled && (
                      <div className="flex space-x-2 ml-6">
                        <div className="flex-1">
                          <label className="text-xs text-muted-foreground">De</label>
                          <Select
                            value={schedules[dayOfWeek]?.afternoonFrom || ""}
                            onValueChange={(value) => handleTimeChange(dayOfWeek, 'afternoonFrom', value)}
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
                        </div>
                        <div className="flex-1">
                          <label className="text-xs text-muted-foreground">À</label>
                          <Select
                            value={schedules[dayOfWeek]?.afternoonTo || ""}
                            onValueChange={(value) => handleTimeChange(dayOfWeek, 'afternoonTo', value)}
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
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:grid md:grid-cols-7 gap-2 items-center">
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`schedule-${dayOfWeek}-desktop`}
                    checked={schedules[dayOfWeek]?.enabled || false}
                    onCheckedChange={() => handleDateToggle(dayOfWeek)}
                  />
                  <label
                    htmlFor={`schedule-${dayOfWeek}-desktop`}
                    className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {dayName}
                  </label>
                </div>
                <span className="text-xs text-muted-foreground ml-6">
                  {dateList}
                </span>
              </div>

              <div className="flex items-center justify-center">
                <Checkbox
                  id={`${dayOfWeek}-morning-desktop`}
                  checked={schedules[dayOfWeek]?.morningEnabled || false}
                  onCheckedChange={() => handlePeriodToggle(dayOfWeek, 'morning')}
                  disabled={!schedules[dayOfWeek]?.enabled}
                />
              </div>

              {schedules[dayOfWeek]?.enabled && schedules[dayOfWeek]?.morningEnabled ? (
                <>
                  <Select
                    value={schedules[dayOfWeek]?.morningFrom || ""}
                    onValueChange={(value) => handleTimeChange(dayOfWeek, 'morningFrom', value)}
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
                    value={schedules[dayOfWeek]?.morningTo || ""}
                    onValueChange={(value) => handleTimeChange(dayOfWeek, 'morningTo', value)}
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
                  id={`${dayOfWeek}-afternoon-desktop`}
                  checked={schedules[dayOfWeek]?.afternoonEnabled || false}
                  onCheckedChange={() => handlePeriodToggle(dayOfWeek, 'afternoon')}
                  disabled={!schedules[dayOfWeek]?.enabled}
                />
              </div>

              {schedules[dayOfWeek]?.enabled && schedules[dayOfWeek]?.afternoonEnabled ? (
                <>
                  <Select
                    value={schedules[dayOfWeek]?.afternoonFrom || ""}
                    onValueChange={(value) => handleTimeChange(dayOfWeek, 'afternoonFrom', value)}
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
                    value={schedules[dayOfWeek]?.afternoonTo || ""}
                    onValueChange={(value) => handleTimeChange(dayOfWeek, 'afternoonTo', value)}
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
          </div>
        );
      })}
    </div>
  );
};
