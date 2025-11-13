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
  const [schedules, setSchedules] = useState<{ [dateKey: string]: ScheduleConfig }>({});

  // Initialize schedules from existing availability data
  useEffect(() => {
    if (existingAvailability && existingAvailability.length > 0) {
      console.log('PrestationScheduleConfig existingAvailability:', existingAvailability);
      const initialSchedules: { [dateKey: string]: ScheduleConfig } = {};

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

        // Use the actual date as key instead of day name
        const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

        console.log(`Processing date ${dateKey}:`, {
          availability,
          morningEnabled: Boolean(availability.morningEnabled),
          afternoonEnabled: Boolean(availability.afternoonEnabled)
        });

        // Each date gets its own individual schedule
        initialSchedules[dateKey] = {
          enabled: Boolean(availability.enabled),
          morningEnabled: Boolean(availability.morningEnabled),
          morningFrom: availability.morningFrom || '',
          morningTo: availability.morningTo || '',
          afternoonEnabled: Boolean(availability.afternoonEnabled),
          afternoonFrom: availability.afternoonFrom || '',
          afternoonTo: availability.afternoonTo || ''
        };
      });

      console.log('Setting schedules from API data:', initialSchedules);
      setSchedules(initialSchedules);
    }
  }, [JSON.stringify(existingAvailability)]); // Use JSON.stringify to properly detect changes

  // Create list of dates with their formatted info
  const sortedDates = selectedDates.sort((a, b) => a.getTime() - b.getTime()).map(date => {
    const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const dayName = format(date, "EEEE", { locale: fr });
    const formattedDate = format(date, "dd/MM/yyyy", { locale: fr });
    return { date, dateKey, dayName, formattedDate };
  });

  // Initialize schedules for new dates that don't have existing data
  useEffect(() => {
    // Only add default schedules for dates that don't exist yet
    setSchedules(prevSchedules => {
      const newSchedules = { ...prevSchedules };
      let hasChanges = false;

      sortedDates.forEach(({ dateKey }) => {
        if (!newSchedules[dateKey]) {
          newSchedules[dateKey] = {
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
  }, [sortedDates.map(d => d.dateKey).join(',')]);

  useEffect(() => {
    if (onChange) {
      onChange(schedules);
    }
  }, [schedules]);

  const handleDateToggle = (dateKey: string) => {
    setSchedules(prev => ({
      ...prev,
      [dateKey]: {
        enabled: !prev[dateKey]?.enabled,
        morningEnabled: prev[dateKey]?.morningEnabled || false,
        morningFrom: prev[dateKey]?.morningFrom || "",
        morningTo: prev[dateKey]?.morningTo || "",
        afternoonEnabled: prev[dateKey]?.afternoonEnabled || false,
        afternoonFrom: prev[dateKey]?.afternoonFrom || "",
        afternoonTo: prev[dateKey]?.afternoonTo || "",
      }
    }));
  };

  const handlePeriodToggle = (dateKey: string, period: 'morning' | 'afternoon') => {
    setSchedules(prev => {
      const current = prev[dateKey] || {} as any;
      const togglingMorning = period === 'morning';
      const nextMorningEnabled = togglingMorning ? !current.morningEnabled : (current.morningEnabled || false);
      const nextAfternoonEnabled = !togglingMorning ? !current.afternoonEnabled : (current.afternoonEnabled || false);

      return {
        ...prev,
        [dateKey]: {
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

  const handleTimeChange = (dateKey: string, field: string, value: string) => {
    setSchedules(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        enabled: prev[dateKey]?.enabled || false,
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
      <div className="text-sm font-medium mb-3">Configuration des horaires ({selectedDates.length} dates sélectionnées)</div>

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

      {sortedDates.map(({ dateKey, dayName, formattedDate }) => {
        return (
          <div key={dateKey}>
            {/* Mobile Layout */}
            <div className="md:hidden space-y-3 border rounded-lg p-3 bg-gray-50">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`schedule-${dateKey}`}
                  checked={schedules[dateKey]?.enabled || false}
                  onCheckedChange={() => handleDateToggle(dateKey)}
                />
                <label
                  htmlFor={`schedule-${dateKey}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {formattedDate} ({dayName})
                </label>
              </div>

              {schedules[dateKey]?.enabled && (
                <div className="space-y-3 ml-6">
                  {/* Morning Section - Mobile */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`${dateKey}-morning-mobile`}
                        checked={schedules[dateKey]?.morningEnabled || false}
                        onCheckedChange={() => handlePeriodToggle(dateKey, 'morning')}
                      />
                      <span className="text-sm font-medium">Matin</span>
                    </div>
                    {schedules[dateKey]?.morningEnabled && (
                      <div className="flex space-x-2 ml-6">
                        <div className="flex-1">
                          <label className="text-xs text-muted-foreground">De</label>
                          <Select
                            value={schedules[dateKey]?.morningFrom || ""}
                            onValueChange={(value) => handleTimeChange(dateKey, 'morningFrom', value)}
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
                            value={schedules[dateKey]?.morningTo || ""}
                            onValueChange={(value) => handleTimeChange(dateKey, 'morningTo', value)}
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
                        id={`${dateKey}-afternoon-mobile`}
                        checked={schedules[dateKey]?.afternoonEnabled || false}
                        onCheckedChange={() => handlePeriodToggle(dateKey, 'afternoon')}
                      />
                      <span className="text-sm font-medium">Après-midi</span>
                    </div>
                    {schedules[dateKey]?.afternoonEnabled && (
                      <div className="flex space-x-2 ml-6">
                        <div className="flex-1">
                          <label className="text-xs text-muted-foreground">De</label>
                          <Select
                            value={schedules[dateKey]?.afternoonFrom || ""}
                            onValueChange={(value) => handleTimeChange(dateKey, 'afternoonFrom', value)}
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
                            value={schedules[dateKey]?.afternoonTo || ""}
                            onValueChange={(value) => handleTimeChange(dateKey, 'afternoonTo', value)}
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
                    id={`schedule-${dateKey}-desktop`}
                    checked={schedules[dateKey]?.enabled || false}
                    onCheckedChange={() => handleDateToggle(dateKey)}
                  />
                  <label
                    htmlFor={`schedule-${dateKey}-desktop`}
                    className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {formattedDate}
                  </label>
                </div>
                <span className="text-xs text-muted-foreground ml-6">
                  ({dayName})
                </span>
              </div>

              <div className="flex items-center justify-center">
                <Checkbox
                  id={`${dateKey}-morning-desktop`}
                  checked={schedules[dateKey]?.morningEnabled || false}
                  onCheckedChange={() => handlePeriodToggle(dateKey, 'morning')}
                  disabled={!schedules[dateKey]?.enabled}
                />
              </div>

              {schedules[dateKey]?.enabled && schedules[dateKey]?.morningEnabled ? (
                <>
                  <Select
                    value={schedules[dateKey]?.morningFrom || ""}
                    onValueChange={(value) => handleTimeChange(dateKey, 'morningFrom', value)}
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
                    value={schedules[dateKey]?.morningTo || ""}
                    onValueChange={(value) => handleTimeChange(dateKey, 'morningTo', value)}
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
                  id={`${dateKey}-afternoon-desktop`}
                  checked={schedules[dateKey]?.afternoonEnabled || false}
                  onCheckedChange={() => handlePeriodToggle(dateKey, 'afternoon')}
                  disabled={!schedules[dateKey]?.enabled}
                />
              </div>

              {schedules[dateKey]?.enabled && schedules[dateKey]?.afternoonEnabled ? (
                <>
                  <Select
                    value={schedules[dateKey]?.afternoonFrom || ""}
                    onValueChange={(value) => handleTimeChange(dateKey, 'afternoonFrom', value)}
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
                    value={schedules[dateKey]?.afternoonTo || ""}
                    onValueChange={(value) => handleTimeChange(dateKey, 'afternoonTo', value)}
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
