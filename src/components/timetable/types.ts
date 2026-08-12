import type { Day } from "@/config/constants";
import type { ClassMode } from "@/config/constants";

/**
 * The flattened, already-resolved shape the timetable client component
 * receives. Building it on the server keeps relationship lookups (and the
 * centre configuration) out of the browser bundle.
 */
export type TimetableEntry = {
  slug: string;
  title: string;
  subjectSlug: string;
  subjectName: string;
  accent?: string;
  level: string;
  day: Day;
  startTime: string;
  endTime: string;
  mode: ClassMode;
  tutorName?: string;
  locationSlug?: string;
  locationName?: string;
  href?: string;
};

export type TimetableFilterOption = { value: string; label: string };
