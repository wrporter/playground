/**
 * 8:50am
 *
 * Write a program for meeting reservations. Requirements:
 * - Be able to reserve a time slot, given a date-time range.
 * - Return an error if the time slot overlaps with an existing reservation.
 * - Be able to cancel a reservation.
 *
 * Book: 2024-10-01T09:00 - 2024-10-01T10:00 -- SUCCESS
 * Book: 2024-10-01T14:00 - 2024-10-01T16:00 -- SUCCESS
 * Book: 2024-10-01T15:00 - 2024-10-01T16:00 -- ERROR due to overlapping time slots
 * Book: 2024-10-01T16:00 - 2024-10-01T17:00 -- SUCCESS
 *
 * Write two functions:
 * - Function that reserves a time slot for a meeting given start date/time and end date/time.
 * Ensure there are no overlapping reservations.  Returns a unique id if valid and saved, returns
 * -1 if reservation overlaps another. If parameters are invalid, return -1.
 * - Function that takes an id to search and delete the booking.  Returns true if successful,
 * otherwise return false.
 *
 *
 * Completed step 1 at 9:10am
 */

interface TimeSlot {
    start: Date;
    end: Date;
}

interface Booking extends TimeSlot {
    id: string;
}

export class Scheduler {
    private bookings: Booking[] = [];

    schedule(booking: TimeSlot) {
        if (this.bookings.some((b) => overlaps(booking, b))) {
            throw new Error(
                'The time slot overlaps with another booking. Please try again with a different time slot',
            );
        }

        const id = createId(6);
        this.bookings.push({ id, ...booking });
        return id;
    }

    cancel(id: string) {
        const index = this.bookings.findIndex((b) => b.id === id);
        if (index < 0) {
            throw new Error(
                `Failed to find booking [${id}]. Please try again with a different ID.`,
            );
        }
        this.bookings.splice(index, 1);
    }

    list() {
        return this.bookings;
    }
}

// Needed to lookup date comparison.

function overlaps(a: TimeSlot, b: TimeSlot) {
    return (a.start > b.start && a.start < b.end) || (a.end > b.start && a.end < b.end);
}

function createId(length: number) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i += 1) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
