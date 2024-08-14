interface TimeSlot {
  start: string;
  end: string;
}

export interface SessionDetails {
  date: string;
  timeSlot: TimeSlot;
}
