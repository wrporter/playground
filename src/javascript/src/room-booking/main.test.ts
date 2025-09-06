import * as util from 'node:util';

import { Scheduler } from './main.js';
import { Scheduler2 } from './main2.js';
import { Scheduler3 } from './main3.js';

it.each([
    {
        input: 0,
        want: 0,
    },
])('todo - %#', ({ input, want }) => {
    expect(input).toEqual(want);
});

it('step 1', () => {
    const scheduler = new Scheduler();
    // Needed to lookup date parsing
    const meeting1 = scheduler.schedule({
        start: new Date('2024-10-01T09:00'),
        end: new Date('2024-10-01T10:00'),
    });
    const meeting2 = scheduler.schedule({
        start: new Date('2024-10-01T14:00'),
        end: new Date('2024-10-01T16:00'),
    });

    expect(() =>
        scheduler.schedule({
            start: new Date('2024-10-01T09:30'),
            end: new Date('2024-10-01T12:00'),
        }),
    ).toThrow();
    expect(() =>
        scheduler.schedule({
            start: new Date('2024-10-01T09:59'),
            end: new Date('2024-10-01T12:00'),
        }),
    ).toThrow();

    scheduler.cancel(meeting1);
    // scheduler.cancel(meeting2);
    console.log(scheduler.list());
});

it('step 2', () => {
    const scheduler = new Scheduler2({
        'Board Room': 12,
        'West Wing': 18,
        'East Wing': 8,
    });

    const meeting1 = scheduler.book({
        start: new Date('2024-10-01T09:00'),
        end: new Date('2024-10-01T10:00'),
        room: 'Board Room',
        attendees: 6,
    });
    const meeting2 = scheduler.book({
        start: new Date('2024-10-01T09:00'),
        end: new Date('2024-10-01T10:00'),
        room: 'West Wing',
        attendees: 15,
    });
    expect(() =>
        scheduler.book({
            start: new Date('2024-10-01T09:00'),
            end: new Date('2024-10-01T10:00'),
            room: 'East Wing',
            attendees: 10,
        }),
    ).toThrowError(/ERR02/);

    // scheduler.cancel(meeting1);
    // scheduler.cancel(meeting2);
    console.log(util.inspect(scheduler.list(), { showHidden: false, depth: null, colors: true }));
});

it('step 3', () => {
    const scheduler = new Scheduler3({
        'Board Room': 12,
        'West Wing': 18,
        'East Wing': 8,
    });

    expect(
        scheduler.findAvailableSlots({
            room: 'Board Room',
            start: new Date('2024-10-01T09:00'),
            end: new Date('2024-10-01T10:00'),
        }),
    ).toEqual([]);

    scheduler.book({
        room: 'Board Room',
        start: new Date('2024-10-01T09:00'),
        end: new Date('2024-10-01T10:00'),
        attendees: 6,
    });

    expect(
        scheduler.findAvailableSlots({
            room: 'Board Room',
            start: new Date('2024-10-01T09:00'),
            end: new Date('2024-10-01T10:00'),
        }),
    ).toEqual([
        {
            start: new Date('2024-10-01T10:00'),
            end: new Date('2024-10-01T11:00'),
        },
        {
            start: new Date('2024-10-01T10:15'),
            end: new Date('2024-10-01T11:15'),
        },
        {
            start: new Date('2024-10-01T10:30'),
            end: new Date('2024-10-01T11:30'),
        },
    ]);
});
