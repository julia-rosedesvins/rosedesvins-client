/** Calendar day of a picker Date in the user's local timezone (YYYY-MM-DD). */
export function pickerDateLocal(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/**
 * Calendar day of a stored eventDate. Events are saved as UTC midnight,
 * so use the UTC date — not the browser's local date.
 */
export function eventCalendarDateUtc(eventDate: string | Date): string {
  const d = new Date(eventDate);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

export function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = String(time || '00:00').split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

export function isHardBusyEventType(eventType?: string): boolean {
  return eventType === 'external' || eventType === 'personal' || eventType === 'blocked';
}

export function isAllDayBusy(slot: {
  isAllDay?: boolean;
  eventTime?: string;
  eventEndTime?: string;
}): boolean {
  if (slot.isAllDay === true) return true;
  return (
    slot.eventTime === '00:00' &&
    (slot.eventEndTime === '23:59' || slot.eventEndTime === '23:59:59')
  );
}

export function eventEndMinutes(
  slot: { eventTime: string; eventEndTime?: string },
  fallbackDuration: number,
): number {
  const start = parseTimeToMinutes(slot.eventTime);
  if (slot.eventEndTime) {
    let end = parseTimeToMinutes(slot.eventEndTime);
    if (end < start) end += 24 * 60;
    return end;
  }
  return start + fallbackDuration;
}

export function intervalsOverlap(
  startA: number,
  endA: number,
  startB: number,
  endB: number,
): boolean {
  return startA < endB && endA > startB;
}

export function isSameCalendarDay(eventDate: string | Date, pickerDate: Date): boolean {
  return eventCalendarDateUtc(eventDate) === pickerDateLocal(pickerDate);
}
