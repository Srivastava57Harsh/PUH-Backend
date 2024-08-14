import { isBefore, isToday, parseISO } from 'date-fns';

export function isValidTimeSlot(timeSlot: { start: string; end: string }): boolean {
  const startHour = parseInt(timeSlot.start.split(':')[0], 10);
  const endHour = parseInt(timeSlot.end.split(':')[0], 10);

  if (startHour < 9 || endHour > 16) {
    return false;
  }

  if (endHour - startHour !== 1 || timeSlot.start.split(':')[1] !== '00' || timeSlot.end.split(':')[1] !== '00') {
    return false;
  }

  return true;
}

export function isBookingInFuture(date: string, timeSlot: { start: string; end: string }): boolean {
  const currentDateTime = new Date();
  const bookingDateTime = parseISO(`${date}T${timeSlot.start}:00`);

  if (isBefore(bookingDateTime, currentDateTime)) {
    return false;
  }

  if (isToday(bookingDateTime) && bookingDateTime <= currentDateTime) {
    return false;
  }

  return true;
}
