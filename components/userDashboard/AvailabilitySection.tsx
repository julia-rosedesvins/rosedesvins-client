'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const weekDays = [
  { id: "lundi", name: "Lundi" },
  { id: "mardi", name: "Mardi" },
  { id: "mercredi", name: "Mercredi" },
  { id: "jeudi", name: "Jeudi" },
  { id: "vendredi", name: "Vendredi" },
  { id: "samedi", name: "Samedi" },
  { id: "dimanche", name: "Dimanche" },
];

const timeOptions = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", 
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"
];

const holidays = [
  { id: "1er-janvier", name: "1er janvier" },
  { id: "lundi-paques", name: "Lundi de Pâques" },
  { id: "1er-mai", name: "1er mai" },
  { id: "8-mai", name: "8 mai" },
  { id: "ascension", name: "Ascension" },
  { id: "lundi-pentecote", name: "Lundi de Pentecôte" },
  { id: "14-juillet", name: "14 juillet" },
  { id: "15-aout", name: "15 août" },
  { id: "1er-novembre", name: "1er novembre" },
  { id: "11-novembre", name: "11 novembre" },
  { id: "25-decembre", name: "25 décembre" },
];

export const AvailabilitySection = () => {
  const [schedules, setSchedules] = useState<{[key: string]: {
    enabled: boolean;
    morningFrom: string;
    morningTo: string;
    afternoonFrom: string;
    afternoonTo: string;
  }}>({});
  
  const [selectedHolidays, setSelectedHolidays] = useState<string[]>([]);

  const handleDayToggle = (dayId: string) => {
    setSchedules(prev => ({
      ...prev,
      [dayId]: {
        enabled: !prev[dayId]?.enabled,
        morningFrom: prev[dayId]?.morningFrom || "",
        morningTo: prev[dayId]?.morningTo || "",
        afternoonFrom: prev[dayId]?.afternoonFrom || "",
        afternoonTo: prev[dayId]?.afternoonTo || "",
      }
    }));
  };

  const handleTimeChange = (dayId: string, field: string, value: string) => {
    setSchedules(prev => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        enabled: prev[dayId]?.enabled || false,
        [field]: value
      }
    }));
  };

  const handleHolidayToggle = (holidayId: string) => {
    setSelectedHolidays(prev => 
      prev.includes(holidayId) 
        ? prev.filter(id => id !== holidayId)
        : [...prev, holidayId]
    );
  };

  return (
    <Card className="mb-6 lg:mb-8">
      <CardHeader>
        <CardTitle className="text-lg lg:text-xl">Disponibilités</CardTitle>
        <p className="text-muted-foreground text-sm lg:text-base">
          Sélectionnez les jours et plages horaires ouverts à la réservation.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 lg:space-y-6">
          {/* Desktop header - hidden on mobile */}
          <div className="hidden lg:grid lg:grid-cols-5 gap-4 mb-4 text-center font-medium text-sm">
            <div></div>
            <div className="col-span-2">Matin</div>
            <div className="col-span-2">Après-midi</div>
          </div>
          
          <div className="hidden lg:grid lg:grid-cols-5 gap-2 mb-4 text-center text-xs text-muted-foreground">
            <div></div>
            <div>de</div>
            <div>à</div>
            <div>de</div>
            <div>à</div>
          </div>
          
          {weekDays.map((day) => (
            <div key={day.id}>
              {/* Mobile layout */}
              <div className="lg:hidden space-y-3">
                <div className="flex items-center space-x-3 p-2">
                  <Checkbox 
                    id={day.id}
                    checked={schedules[day.id]?.enabled || false}
                    onCheckedChange={() => handleDayToggle(day.id)}
                  />
                  <label 
                    htmlFor={day.id} 
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {day.name}
                  </label>
                </div>
                
                {schedules[day.id]?.enabled ? (
                  <div className="pl-4 space-y-4">
                    <div>
                      <div className="text-sm font-medium mb-2 text-gray-700">Matin</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">de</label>
                          <Select
                            value={schedules[day.id]?.morningFrom || ""}
                            onValueChange={(value) => handleTimeChange(day.id, 'morningFrom', value)}
                          >
                            <SelectTrigger className="h-10 text-sm">
                              <SelectValue placeholder="08:00" />
                            </SelectTrigger>
                            <SelectContent className="bg-white z-50">
                              {timeOptions.slice(0, 11).map((time) => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">à</label>
                          <Select
                            value={schedules[day.id]?.morningTo || ""}
                            onValueChange={(value) => handleTimeChange(day.id, 'morningTo', value)}
                          >
                            <SelectTrigger className="h-10 text-sm">
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
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-2 text-gray-700">Après-midi</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">de</label>
                          <Select
                            value={schedules[day.id]?.afternoonFrom || ""}
                            onValueChange={(value) => handleTimeChange(day.id, 'afternoonFrom', value)}
                          >
                            <SelectTrigger className="h-10 text-sm">
                              <SelectValue placeholder="13:00" />
                            </SelectTrigger>
                            <SelectContent className="bg-white z-50">
                              {timeOptions.slice(10).map((time) => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">à</label>
                          <Select
                            value={schedules[day.id]?.afternoonTo || ""}
                            onValueChange={(value) => handleTimeChange(day.id, 'afternoonTo', value)}
                          >
                            <SelectTrigger className="h-10 text-sm">
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
                    </div>
                  </div>
                ) : (
                  <div className="pl-7 text-sm text-muted-foreground">Fermé</div>
                )}
              </div>

              {/* Desktop layout */}
              <div className="hidden lg:grid lg:grid-cols-5 gap-2 items-center">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id={`${day.id}-desktop`}
                    checked={schedules[day.id]?.enabled || false}
                    onCheckedChange={() => handleDayToggle(day.id)}
                  />
                  <label 
                    htmlFor={`${day.id}-desktop`} 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {day.name}
                  </label>
                </div>
                
                {schedules[day.id]?.enabled ? (
                  <>
                    <Select
                      value={schedules[day.id]?.morningFrom || ""}
                      onValueChange={(value) => handleTimeChange(day.id, 'morningFrom', value)}
                      disabled={!schedules[day.id]?.enabled}
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
                      value={schedules[day.id]?.morningTo || ""}
                      onValueChange={(value) => handleTimeChange(day.id, 'morningTo', value)}
                      disabled={!schedules[day.id]?.enabled}
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
                    
                    <Select
                      value={schedules[day.id]?.afternoonFrom || ""}
                      onValueChange={(value) => handleTimeChange(day.id, 'afternoonFrom', value)}
                      disabled={!schedules[day.id]?.enabled}
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
                      value={schedules[day.id]?.afternoonTo || ""}
                      onValueChange={(value) => handleTimeChange(day.id, 'afternoonTo', value)}
                      disabled={!schedules[day.id]?.enabled}
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
                  <div className="col-span-4 text-left text-xs text-muted-foreground">Fermé</div>
                )}
              </div>
            </div>
          ))}
          
          <div className="mt-6 lg:mt-8">
            <div className="text-sm lg:text-base font-medium mb-3">Jours fériés</div>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex items-center justify-between w-full h-12 lg:h-10 text-sm lg:text-base px-4 border-2 hover:bg-opacity-5"
                  style={{ 
                    borderColor: '#3A7B59',
                    color: '#3A7B59'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#3A7B59';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#3A7B59';
                  }}
                >
                  <span>
                    {selectedHolidays.length === 0 
                      ? "Cliquer pour voir les dates" 
                      : `${selectedHolidays.length} jour${selectedHolidays.length > 1 ? 's' : ''} sélectionné${selectedHolidays.length > 1 ? 's' : ''}`
                    }
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 lg:w-64 p-0" align="start">
                <div className="max-h-64 overflow-y-auto">
                  {holidays.map((holiday) => (
                    <div key={holiday.id} className="flex items-center space-x-3 p-3 lg:p-2 hover:bg-muted/50">
                      <Checkbox 
                        id={`holiday-${holiday.id}`}
                        checked={selectedHolidays.includes(holiday.id)}
                        onCheckedChange={() => handleHolidayToggle(holiday.id)}
                      />
                      <label 
                        htmlFor={`holiday-${holiday.id}`} 
                        className="text-sm lg:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {holiday.name}
                      </label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};