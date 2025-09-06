# Title

- I felt like it was difficult to understand the requirements. And had to read the questions several times. Maybe this is because I tested the question while sick and didn't sleep well. I'm visual and so having examples is really helpful. The examples with function signatures is distracting because it makes me think of a specific API which I might not agree with.
- I think it would be best if we don't give any notion of an API and allow the candidate to drive that. So let's just show raw examples from the perspective of a user that doesn't know code.
- I later discovered a bug with overlapping dates. It might be nice to use that as a Step 0.
- I had to speed through to get to Step 3 and finished in 1 hour from the start. Can we shrink the requirements or get the candidate there faster?
  - I was slow with looking up several APIs. Should we provide this, like how to add minutes to a date or parse a date string (just the constructor, but reduces one more API lookup)?
  - I was slow to copy over the input data. Should we provide examples in a way that makes them easily copy/paste-able to the code?
- Add a follow-up questions for MTS-3+.
  - How can we optimize performance for the current known use cases? 
    - (Particularly looking at data structures and access patterns.)
  - How can we make the solution thread-safe? 
    - (Node.js is single-threaded, so this wouldn't apply in most cases. It would be better suited for other languages. This is also an experience-specific question. Only ask or really care about the quality of the answer if this is a skill you are specifically hiring for.)


action items
- add test cases to coderbyte (maybe console log statements)
- Consider adding a version 0 that is to write a function to determine overlapping date ranges
- Potential followup questions for MTS-4+
  - How would you make your solution performant enough to handle millions of reservations?
  - How can we optimize if there are no reservations available for 15 days?


## Step 1

Write a program for meeting reservations. Requirements:
- Be able to reserve a time slot, given a date-time range.
- Return an error if the time slot overlaps with an existing reservation.
- Be able to cancel a reservation.

Examples:

Reserve: 2024-10-01T09:00 - 2024-10-01T10:00 -- SUCCESS
Reserve: 2024-10-01T14:00 - 2024-10-01T16:00 -- SUCCESS
Reserve: 2024-10-01T15:00 - 2024-10-01T16:00 -- ERROR due to overlapping time slots
Reserve: 2024-10-01T16:00 - 2024-10-01T17:00 -- SUCCESS

## Step 2

We have a new requirement to add rooms that can be reserved. Each room has a capacity.
- When adding a reservation, the user now has to specify the room and the number of attendees.
- Return an error if the time slot overlaps with an existing reservation for that specific room.
- Return an error if the room does not have the capacity for the given number of attendees.
- Users need a way to cancel reservations.
- The following rooms can be used.

| Room Name  | Capacity |
|------------|----------|
| Board Room | 12       |
| West Wing  | 18       |
| East Wing  | 8        |

Examples:

Reserve: 2024-10-01T09:00 - 2024-10-01T10:00, Board Room, 6 attendees -- SUCCESS
Reserve: 2024-10-01T09:00 - 2024-10-01T10:00, West Wing, 15 attendees -- SUCCESS
Reserve: 2024-10-01T09:45 - 2024-10-01T10:15, West Wing, 2 attendees  -- ERROR overlaps with an existing reservation
Reserve: 2024-10-01T15:00 - 2024-10-01T16:00, East Wing, 10 attendees -- ERROR the East Wing does not have capacity for 10 attendees

## Step 3

Add the ability to suggest the next 3 times a room is available.
- Assume meetings can only start at :00, :15, :30, or :45 of each hour.
- Each suggestion can be increments of 15 minutes.
- Suggestions should have the same meeting length that the user is searching for.

Examples:

Reserve: 2024-10-01T09:00 - 2024-10-01T10:00, Board Room, 5 attendees
Reserve: 2024-10-01T10:30 - 2024-10-01T11:30, Board Room, 8 attendees

Search:  2024-10-01T09:00 - 2024-10-01T09:30, Board Room
  - Suggestions:
    - 2024-10-01T10:00 - 2024-10-01T10:30
    - 2024-10-01T11:30 - 2024-10-01T12:00
    - 2024-10-01T11:45 - 2024-10-01T12:15

Search:  2024-10-01T13:00 - 2024-10-01T14:00, Board Room
  - Suggestions:
    - 2024-10-01T13:00 - 2024-10-01T14:00
    - 2024-10-01T13:15 - 2024-10-01T14:15
    - 2024-10-01T13:30 - 2024-10-01T14:30

