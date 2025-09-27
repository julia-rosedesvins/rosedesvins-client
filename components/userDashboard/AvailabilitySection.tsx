'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown, Save, Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { availabilityService, AvailabilityData, TimeSlot, ApiError } from "@/services/availability.service";
import toast from 'react-hot-toast';

const weekDays = [
  { id: "monday", name: "Lundi" },
  { id: "tuesday", name: "Mardi" },
  { id: "wednesday", name: "Mercredi" },
  { id: "thursday", name: "Jeudi" },
  { id: "friday", name: "Vendredi" },
  { id: "saturday", name: "Samedi" },
  { id: "sunday", name: "Dimanche" },
];

const timeOptions = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", 
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"
];

const holidays = [
  { id: "new-year", name: "1er janvier", date: "2025-01-01" },
  { id: "easter-monday", name: "Lundi de Pâques", date: "2025-04-21" },
  { id: "labor-day", name: "1er mai", date: "2025-05-01" },
  { id: "victory-day", name: "8 mai", date: "2025-05-08" },
  { id: "ascension", name: "Ascension", date: "2025-05-29" },
  { id: "whit-monday", name: "Lundi de Pentecôte", date: "2025-06-09" },
  { id: "bastille-day", name: "14 juillet", date: "2025-07-14" },
  { id: "assumption", name: "15 août", date: "2025-08-15" },
  { id: "all-saints", name: "1er novembre", date: "2025-11-01" },
  { id: "armistice", name: "11 novembre", date: "2025-11-11" },
  { id: "christmas", name: "25 décembre", date: "2025-12-25" },
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
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [originalData, setOriginalData] = useState<{
    schedules: typeof schedules;
    holidays: string[];
  }>({ schedules: {}, holidays: [] });

  // Load availability data on component mount
  useEffect(() => {
    loadAvailabilityData();
  }, []);

  // Track changes by comparing current state with original data
  useEffect(() => {
    if (!initialDataLoaded) return;

    // Deep compare schedules
    const schedulesChanged = JSON.stringify(schedules) !== JSON.stringify(originalData.schedules);
    
    // Compare holidays
    const holidaysChanged = JSON.stringify(selectedHolidays.sort()) !== JSON.stringify(originalData.holidays.sort());
    
    const hasDataChanges = schedulesChanged || holidaysChanged;

    setHasChanges(hasDataChanges);
  }, [schedules, selectedHolidays, initialDataLoaded, originalData]);

  const loadAvailabilityData = async () => {
    setIsLoading(true);
    try {
      const response = await availabilityService.getAvailability();
      
      if (response.data) {
        // Convert API data to component state format
        const apiData = response.data;
        const convertedSchedules: typeof schedules = {};
        
        weekDays.forEach(day => {
          const dayData = apiData.weeklyAvailability[day.id as keyof typeof apiData.weeklyAvailability];
          if (dayData) {
            // Convert time slots to morning/afternoon format
            const timeSlots = dayData.timeSlots || [];
            let morningFrom = "";
            let morningTo = "";
            let afternoonFrom = "";
            let afternoonTo = "";

            // Simple logic: first slot is morning, second slot is afternoon
            if (timeSlots[0]) {
              morningFrom = timeSlots[0].startTime;
              morningTo = timeSlots[0].endTime;
            }
            if (timeSlots[1]) {
              afternoonFrom = timeSlots[1].startTime;
              afternoonTo = timeSlots[1].endTime;
            }

            convertedSchedules[day.id] = {
              enabled: dayData.isAvailable,
              morningFrom,
              morningTo,
              afternoonFrom,
              afternoonTo,
            };
          }
        });

        setSchedules(convertedSchedules);
        
        // Convert public holidays to selected holidays
        const holidayIds = apiData.publicHolidays
          .filter(holiday => holiday.isBlocked !== false)
          .map(holiday => {
            // Map holiday dates to IDs
            const foundHoliday = holidays.find(h => h.date === holiday.date.split('T')[0]);
            return foundHoliday?.id;
          })
          .filter(Boolean) as string[];
          
        setSelectedHolidays(holidayIds);
        
        // Store original data for change detection
        setOriginalData({
          schedules: convertedSchedules,
          holidays: holidayIds
        });
        
        setHasChanges(false);
        setInitialDataLoaded(true);
        
        console.log('✅ Availability data loaded successfully');
      } else {
        console.log('ℹ️ No availability data found, using defaults');
        
        // Store empty original data
        setOriginalData({
          schedules: {},
          holidays: []
        });
        
        setHasChanges(false);
        setInitialDataLoaded(true);
      }
    } catch (error) {
      console.error('❌ Failed to load availability data:', error);
      toast.error('Erreur lors du chargement des disponibilités');
    } finally {
      setIsLoading(false);
    }
  };

  const saveAvailabilityData = async () => {
    setIsSaving(true);
    try {
      // Convert component state to API format
      const weeklyAvailability: any = {};
      
      weekDays.forEach(day => {
        const schedule = schedules[day.id];
        const timeSlots: TimeSlot[] = [];
        
        // Add morning slot if both times are set
        if (schedule?.enabled && schedule.morningFrom && schedule.morningTo) {
          timeSlots.push({
            startTime: schedule.morningFrom,
            endTime: schedule.morningTo
          });
        }
        
        // Add afternoon slot if both times are set
        if (schedule?.enabled && schedule.afternoonFrom && schedule.afternoonTo) {
          timeSlots.push({
            startTime: schedule.afternoonFrom,
            endTime: schedule.afternoonTo
          });
        }
        
        weeklyAvailability[day.id] = {
          isAvailable: schedule?.enabled || false,
          timeSlots
        };
      });

      // Convert selected holidays to public holidays format
      const publicHolidays = selectedHolidays.map(holidayId => {
        const holiday = holidays.find(h => h.id === holidayId);
        return {
          name: holiday!.name,
          date: `${holiday!.date}T00:00:00.000Z`,
          isBlocked: true,
          isRecurring: true
        };
      });

      const availabilityData: AvailabilityData = {
        weeklyAvailability,
        publicHolidays,
        specialDateOverrides: [],
        timezone: "Europe/Paris",
        defaultSlotDuration: 30,
        bufferTime: 0,
        isActive: true
      };

      await availabilityService.saveAvailability(availabilityData);
      
      toast.success('✅ Disponibilités sauvegardées avec succès!');
      
      // Update original data to reflect the saved state
      setOriginalData({
        schedules: { ...schedules },
        holidays: [...selectedHolidays]
      });
      
      setHasChanges(false);
      
    } catch (error) {
      console.error('❌ Failed to save availability:', error);
      
      if (error && typeof error === 'object' && 'success' in error && error.success === false) {
        const apiError = error as ApiError;
        
        if (apiError.errors && apiError.errors.length > 0) {
          // Show field-specific errors
          apiError.errors.forEach(err => {
            toast.error(`Erreur ${err.field}: ${err.message}`);
          });
        } else {
          toast.error(apiError.message || 'Erreur lors de la sauvegarde');
        }
      } else {
        toast.error('Une erreur inattendue s\'est produite');
      }
    } finally {
      setIsSaving(false);
    }
  };

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
    console.log('⏰ Time change:', { dayId, field, value });
    console.log('📊 Before update:', schedules[dayId]);
    
    setSchedules(prev => {
      const updated = {
        ...prev,
        [dayId]: {
          ...prev[dayId],
          enabled: prev[dayId]?.enabled || false,
          [field]: value
        }
      };
      
      console.log('📊 After update:', updated[dayId]);
      return updated;
    });
  };

  const handleHolidayToggle = (holidayId: string) => {
    setSelectedHolidays(prev => 
      prev.includes(holidayId) 
        ? prev.filter(id => id !== holidayId)
        : [...prev, holidayId]
    );
  };

  return (
    <Card className="mb-6 lg:mb-8 relative shadow-sm border-0 bg-white ring-1 ring-gray-200 hover:ring-gray-300 transition-all duration-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl lg:text-2xl font-semibold text-gray-900">Disponibilités</CardTitle>
        <p className="text-gray-600 text-sm lg:text-base leading-relaxed mt-1">
          Définissez vos créneaux de disponibilité pour recevoir des réservations.
        </p>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-6 lg:space-y-8">
          {/* Desktop header - hidden on mobile */}
          <div className="hidden lg:grid lg:grid-cols-5 gap-4 mb-6 text-center">
            <div></div>
            <div className="col-span-2 font-semibold text-gray-700 text-sm">Matin</div>
            <div className="col-span-2 font-semibold text-gray-700 text-sm">Après-midi</div>
          </div>
          
          <div className="hidden lg:grid lg:grid-cols-5 gap-2 mb-6 text-center text-xs text-gray-500">
            <div></div>
            <div className="font-medium">de</div>
            <div className="font-medium">à</div>
            <div className="font-medium">de</div>
            <div className="font-medium">à</div>
          </div>
          
          {weekDays.map((day, index) => (
            <div key={day.id} className={`${index !== weekDays.length - 1 ? 'border-b border-gray-100 pb-4' : ''}`}>
              {/* Mobile layout */}
              <div className="lg:hidden space-y-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                  <Checkbox 
                    id={day.id}
                    checked={schedules[day.id]?.enabled || false}
                    onCheckedChange={() => handleDayToggle(day.id)}
                    className="data-[state=checked]:bg-[#3A7B59] data-[state=checked]:border-[#3A7B59]"
                  />
                  <label 
                    htmlFor={day.id} 
                    className="text-base font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-800 cursor-pointer"
                  >
                    {day.name}
                  </label>
                </div>
                
                {schedules[day.id]?.enabled ? (
                  <div className="pl-6 space-y-4">
                    <div>
                      <div className="text-sm font-semibold mb-3 text-gray-700">Matin</div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-2 block">de</label>
                          <Select
                            value={schedules[day.id]?.morningFrom || ""}
                            onValueChange={(value) => handleTimeChange(day.id, 'morningFrom', value)}
                          >
                            <SelectTrigger className="h-11 text-sm border-gray-300 focus:border-[#3A7B59] focus:ring-[#3A7B59] hover:border-gray-400 transition-colors">
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
                          <label className="text-xs font-medium text-gray-600 mb-2 block">à</label>
                          <Select
                            value={schedules[day.id]?.morningTo || ""}
                            onValueChange={(value) => handleTimeChange(day.id, 'morningTo', value)}
                          >
                            <SelectTrigger className="h-11 text-sm border-gray-300 focus:border-[#3A7B59] focus:ring-[#3A7B59] hover:border-gray-400 transition-colors">
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
                      <div className="text-sm font-semibold mb-3 text-gray-700">Après-midi</div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-2 block">de</label>
                          <Select
                            value={schedules[day.id]?.afternoonFrom || ""}
                            onValueChange={(value) => handleTimeChange(day.id, 'afternoonFrom', value)}
                          >
                            <SelectTrigger className="h-11 text-sm border-gray-300 focus:border-[#3A7B59] focus:ring-[#3A7B59] hover:border-gray-400 transition-colors">
                              <SelectValue placeholder="14:00" />
                            </SelectTrigger>
                            <SelectContent className="bg-white z-50">
                              {timeOptions.slice(10).map((time) => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-2 block">à</label>
                          <Select
                            value={schedules[day.id]?.afternoonTo || ""}
                            onValueChange={(value) => handleTimeChange(day.id, 'afternoonTo', value)}
                          >
                            <SelectTrigger className="h-11 text-sm border-gray-300 focus:border-[#3A7B59] focus:ring-[#3A7B59] hover:border-gray-400 transition-colors">
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
                  <div className="pl-9 text-sm text-gray-500 font-medium">Fermé</div>
                )}
              </div>

              {/* Desktop layout */}
              <div className="hidden lg:grid lg:grid-cols-5 gap-2 items-center py-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id={`${day.id}-desktop`}
                    checked={schedules[day.id]?.enabled || false}
                    onCheckedChange={() => handleDayToggle(day.id)}
                    className="data-[state=checked]:bg-[#3A7B59] data-[state=checked]:border-[#3A7B59]"
                  />
                  <label 
                    htmlFor={`${day.id}-desktop`} 
                    className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-800 cursor-pointer"
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
                      <SelectTrigger className="h-9 text-xs border-gray-300 focus:border-[#3A7B59] focus:ring-[#3A7B59] hover:border-gray-400 transition-colors">
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
                      <SelectTrigger className="h-9 text-xs border-gray-300 focus:border-[#3A7B59] focus:ring-[#3A7B59] hover:border-gray-400 transition-colors">
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
                      <SelectTrigger className="h-9 text-xs border-gray-300 focus:border-[#3A7B59] focus:ring-[#3A7B59] hover:border-gray-400 transition-colors">
                        <SelectValue placeholder="14:00" />
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
                      <SelectTrigger className="h-9 text-xs border-gray-300 focus:border-[#3A7B59] focus:ring-[#3A7B59] hover:border-gray-400 transition-colors">
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
                  <div className="col-span-4 text-left text-xs text-gray-500 font-medium">Fermé</div>
                )}
              </div>
            </div>
          ))}
          
          <div className="mt-8 lg:mt-10 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-base lg:text-lg font-semibold mb-4 text-gray-800">Jours fériés</div>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex items-center justify-between w-full h-12 lg:h-11 text-sm lg:text-base px-4 border-2 hover:shadow-sm transition-all duration-200"
                  style={{ 
                    borderColor: '#3A7B59',
                    color: '#3A7B59',
                    backgroundColor: 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#3A7B59';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.color = '#3A7B59';
                  }}
                >
                  <span className="font-medium">
                    {selectedHolidays.length === 0 
                      ? "Sélectionnez vos jours fériés" 
                      : `${selectedHolidays.length} jour${selectedHolidays.length > 1 ? 's' : ''} sélectionné${selectedHolidays.length > 1 ? 's' : ''}`
                    }
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 lg:w-72 p-0 shadow-lg border-gray-200" align="start">
                <div className="max-h-64 overflow-y-auto">
                  {holidays.map((holiday) => (
                    <div key={holiday.id} className="flex items-center space-x-3 p-3 lg:p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors">
                      <Checkbox 
                        id={`holiday-${holiday.id}`}
                        checked={selectedHolidays.includes(holiday.id)}
                        onCheckedChange={() => handleHolidayToggle(holiday.id)}
                        className="data-[state=checked]:bg-[#3A7B59] data-[state=checked]:border-[#3A7B59]"
                      />
                      <label 
                        htmlFor={`holiday-${holiday.id}`} 
                        className="text-sm lg:text-sm font-medium leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-gray-700 flex-1"
                      >
                        {holiday.name}
                      </label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <Button
              onClick={saveAvailabilityData}
              disabled={!hasChanges || isSaving || isLoading}
              className="bg-[#3A7B59] hover:bg-[#2d5a43] text-white px-8 py-3 flex items-center gap-2 font-semibold text-base shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Sauvegarder les disponibilités
                </>
              )}
            </Button>
          </div>
        </div>
        
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="flex items-center gap-3 text-[#3A7B59] bg-white px-6 py-3 rounded-lg shadow-lg">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="font-medium">Chargement des disponibilités...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};