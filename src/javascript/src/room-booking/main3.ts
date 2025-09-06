/**
 * 8:50am
 *
 * Write two functions:
 * Function that reserves a time slot for a meeting given start date/time and end date/time. Ensure
 * there are no overlapping reservations.  Returns a unique id if valid and saved, returns -1 if
 * reservation overlaps another. If parameters are invalid, return -1. Function that takes an id to
 * search and delete the booking.  Returns true if successful, otherwise return false.
 *
 * Completed step 1 at 9:10am
 * - Needed to take care of my sick son. Stopped at 9:13am and cam back at 9:22am.
 * 9:23am - need to consider how to structure the data/base
 *
 * 9:38am - finished step 2
 * 9:41am - understood step 3
 */

interface TimeSlot {
    start: Date;
    end: Date;
}

interface TimeSlotRequest extends TimeSlot {
    room: string;
    attendees: number;
}

interface FindSlotRequest extends TimeSlot {
    room: string;
}

interface Booking extends TimeSlotRequest {
    id: string;
}

interface Room {
    name: string;
    capacity: number;
    schedule: Omit<Booking, 'room'>[];
}

export class Scheduler3 {
    private rooms: Record<string, Room>;

    constructor(rooms: Record<string, number>) {
        this.rooms = Object.entries(rooms).reduce(
            (rooms, [name, capacity]) => {
                rooms[name] = { name, capacity, schedule: [] };
                return rooms;
            },
            {} as Record<string, Room>,
        );
    }

    book(request: TimeSlotRequest) {
        const room = this.rooms[request.room];
        if (!room) {
            throw new Error(
                `ERR01: Room ${request.room} does not exist. Please try a different room.`,
            );
        }
        if (request.attendees > room.capacity) {
            throw new Error(
                `ERR02: Room ${room.name} may only fit ${room.capacity} people and cannot fit the requested ${request.attendees}. Please try a different room or decrease the amount of attendees.`,
            );
        }
        if (room.schedule.some((b) => overlaps(request, b))) {
            throw new Error(
                'ERR03: The time slot overlaps with another booking. Please try again with a different time slot',
            );
        }

        const id = createId(6);
        room.schedule.push({ id, ...request });
        return id;
    }

    cancel(id: string) {
        const found = Object.entries(this.rooms).find(([, { schedule }]) =>
            schedule.find((b) => b.id === id),
        );
        if (!found) {
            throw new Error(
                `ERR04: Failed to find booking [${id}]. Please try again with a different ID.`,
            );
        }
        const [, room] = found;
        const index = room.schedule.findIndex((b) => b.id === id);
        room.schedule.splice(index, 1);
    }

    findAvailableSlots(request: FindSlotRequest) {
        const room = this.rooms[request.room];
        if (!room) {
            throw new Error(
                `ERR01: Room ${request.room} does not exist. Please try a different room.`,
            );
        }
        if (!room.schedule.some((b) => overlaps(request, b))) {
            return [];
        }

        // const length = request.end.getTime() - request.start.getTime();
        // TODO: Jump to next 15 minute slot. Assume times given at 15 minute intervals for now.

        // Need to lookup how to add minutes to a date
        const available: TimeSlot[] = [];
        let start = addMinutes(request.start, 15);
        let end = addMinutes(request.end, 15);
        while (available.length < 3) {
            if (!room.schedule.some((b) => overlaps({ start, end }, b))) {
                available.push({ start, end });
            }
            start = addMinutes(start, 15);
            end = addMinutes(end, 15);
        }

        return available;
    }

    list() {
        return this.rooms;
    }
}

function addMinutes(date: Date, minutes: number) {
    return new Date(date.getTime() + minutes * 60 * 1000);
}

// Needed to lookup date comparison.

function overlaps(a: TimeSlot, b: TimeSlot) {
    return (
        (a.start.getTime() === b.start.getTime() && a.end.getTime() === b.end.getTime()) ||
        (a.start > b.start && a.start < b.end) ||
        (a.end > b.start && a.end < b.end)
    );
}

function createId(length: number) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i += 1) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
