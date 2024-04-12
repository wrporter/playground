/**
 *
 * Problem:
 * At Outschool, classes consist of sections scheduled at specific times.
 * If parents cannot find a section that works with their own schedule, they
 * can send a request to the teacher to schedule another section.
 *
 * Find a specific time to schedule a 1-hour section that works for the parent
 * and the teacher. The parent's request is described by a parentRequest,
 * which lists the days of week and times of day they are usually available.
 * The teacher's availability is similarly stored as days of week and times of
 * day. The teacher's availability is also constrained by a list of already
 * scheduled sections.
 *
 * Task:
 * Implement a function named `suggestSchedule` that gets two parameters:
 * - a parent request
 * - a teacher
 *
 * and it returns one section suggestion that starts two weeks later.
 *
 * Implement your function inside this test file. This test file has 5 tests
 * that your function should pass.
 *
 * Remarks:
 * - Use getTeacherAvailability function to get teacher's availability
 * - Use getTeacherSchedule function to get teacher's existing schedule
 *
 */
const { assert } = require('chai');
const _ = require('lodash');
const Mocha = require('mocha');

const mocha = new Mocha();
mocha.suite.emit('pre-require', this, 'solution', mocha);

describe('Interview - Auto Schedule Suggestion', function () {
    describe('1) Parent prefers a class on Monday anytime between 9am and 1pm', () => {
        it('should return Mon 9am as a suggestion', async () => {
            const teacher = {
                id: 'foo',
                name: 'Test',
            };
            const parentRequest = {
                Monday: [9, 10, 11, 12],
                Tuesday: [9, 10, 11],
            };
            const result = suggestSchedule(parentRequest, teacher);
            assert.deepEqual(result, {
                start_time: twoWeeksLater('Monday', 9),
                end_time: twoWeeksLater('Monday', 10),
            });
        });
    });

    describe('2) Parent prefers a class on Monday anytime between 5pm and 9pm', () => {
        it('should return Mon 6pm as a suggestion because teacher already has another section at 5pm', async () => {
            const teacher = {
                id: 'foo',
                name: 'Test',
            };
            const parentRequest = {
                Monday: [17, 18, 19, 20],
            };
            const result = suggestSchedule(parentRequest, teacher);
            assert.deepEqual(result, {
                start_time: twoWeeksLater('Monday', 18),
                end_time: twoWeeksLater('Monday', 19),
            });
        });
    });

    describe('3) Parent prefers a class on Thursday or Friday anytime between 9am and 12pm', () => {
        it('should return Friday 10am as a suggestion', async () => {
            const teacher = {
                id: 'foo',
                name: 'Test',
            };
            const parentRequest = {
                Thursday: [9, 10, 11],
                Friday: [9, 10, 11],
            };
            const result = suggestSchedule(parentRequest, teacher);
            assert.deepEqual(result, {
                start_time: twoWeeksLater('Friday', 10),
                end_time: twoWeeksLater('Friday', 11),
            });
        });
    });

    describe('4) Parent prefers a class on Wednesday anytime between 9am and 12pm', () => {
        it('should return null', async () => {
            const teacher = {
                id: 'foo',
                name: 'Test',
            };
            const parentRequest = {
                Wednesday: [9, 10, 11],
            };
            const result = suggestSchedule(parentRequest, teacher);
            assert.isNull(result);
        });
    });

    describe('5) Parent prefers a class on Sunday or Monday anytime between 9am and 12pm', () => {
        // Note: for this exercise we consider Sunday as the first day
        it('should return Sunday 10am as a suggestion', async () => {
            const teacher = {
                id: 'foo',
                name: 'Test',
            };
            const parentRequest = {
                Monday: [9, 10, 11],
                Sunday: [9, 10, 11],
            };
            const result = suggestSchedule(parentRequest, teacher);
            assert.deepEqual(result, {
                start_time: twoWeeksLater('Sunday', 10),
                end_time: twoWeeksLater('Sunday', 11),
            });
        });
    });
});

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Returns a section that matches parent's request and teacher's availability,
 * and does not conflict with teacher's schedule. (first availability in 2 weeks)
 *
 * If no suggestion can be made, returns null.
 * @param parentRequest A hash of days with hours as an array.
 *                      Ex: {"Monday": [9, 10, ...], ...}
 * @param teacher An object with id and name fields
 * @returns Section A Section object where
 *    section is {start_time: Date, end_time: Date}.
 */
function suggestSchedule(parentRequest, teacher) {
    const teacherAvailability = getTeacherAvailability(teacher);
    const teacherSchedule = getTeacherSchedule(teacher);

    for (let day = 0; day < DAYS.length; day++) {
        const dayName = DAYS[day];

        // 1. Merge teacher availability with their schedule to get their true availability.
        const availableTeacherHours = teacherAvailability[dayName].filter(
            (availableHour) =>
                !teacherSchedule.some(
                    ({ start_time, end_time }) =>
                        start_time.getDay() === day &&
                        availableHour >= start_time.getHours() &&
                        availableHour < end_time.getHours(),
                ),
        );

        // 2. Find the first open spot on the teacher's availability that matches the parent's availability.
        const hour = availableTeacherHours.find(
            (availableTeacherHour) =>
                parentRequest[dayName]?.some(
                    (availableParentHour) => availableTeacherHour === availableParentHour,
                ),
        );

        // console.log(dayName, availableTeacherHours, hour)

        // 3. As soon as we find a match, return.

        if (hour) {
            const date = twoWeeksLater(dayName, hour);
            return {
                start_time: date,
                end_time: addOneHour(date),
            };
        }
    }

    return null;
}

/**
 * Returns a Date object that is two weeks in the future.
 * @param day "Monday", "Tuesday", ...
 * @param hour 9, 10, ..., 15, 16, ...
 * @returns Date
 */
function twoWeeksLater(day, hour) {
    day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(
        day,
    );
    const now = new Date();
    const weekDay = now.getDay();
    const diff = now.getDate() - weekDay;
    now.setDate(diff + day);
    now.setHours(hour, 0, 0, 0);
    return new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
}

/**
 * Add one hour to date and return a new Date
 * @param date Date
 * @returns Date
 */
function addOneHour(date) {
    date = new Date(date);
    date.setHours(date.getHours() + 1);
    return date;
}

/**
 * Returns teacher's availability as a dictionary
 * @param teacher
 * @returns {Day: [hours], ...} A dictionary of week days with values of hours of the day
 */
function getTeacherAvailability(teacher) {
    return {
        Monday: [9, 10, 11, 12, 17, 18, 19, 20],
        Tuesday: [9, 10, 11],
        Wednesday: [],
        Thursday: [],
        Friday: [10, 11],
        Saturday: [],
        Sunday: [10],
    };
}

/**
 * Returns teacher's existing sections as a list
 * @param teacher
 * @returns [Section] An array of sections where a section is represented as {start_time, end_time}.
 */
function getTeacherSchedule(teacher) {
    const start = twoWeeksLater('Monday', 17);
    return [
        {
            start_time: start,
            end_time: addOneHour(start),
        },
    ];
}

mocha.run();
