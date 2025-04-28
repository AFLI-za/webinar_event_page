declare module 'ics' {
  export interface EventAttributes {
    start: [number, number, number, number, number];
    end?: [number, number, number, number, number];
    title: string;
    description?: string;
    location?: string;
    url?: string;
    geo?: { lat: string; lon: string };
    categories?: string[];
    status?: string;
    busyStatus?: string;
    organizer?: { name: string; email: string };
    attendees?: Array<{
      name: string;
      email: string;
      rsvp?: boolean;
      role?: string;
      status?: string;
    }>;
    alarms?: Array<{
      action: string;
      trigger: { hours?: number; minutes?: number; days?: number; before: boolean };
      description?: string;
      summary?: string;
      attendees?: Array<{ name: string; email: string }>;
      attach?: string;
      duration?: { hours?: number; minutes?: number };
      repeat?: number;
    }>;
    productId?: string;
    uid?: string;
    sequence?: number;
    created?: [number, number, number, number, number];
    lastModified?: [number, number, number, number, number];
    recurrenceRule?: string;
  }

  export function createEvent(
    attributes: EventAttributes,
    callback: (error: Error | null, value: string) => void
  ): void;

  export function createEvents(
    events: EventAttributes[],
    callback: (error: Error | null, value: string) => void
  ): void;
}
