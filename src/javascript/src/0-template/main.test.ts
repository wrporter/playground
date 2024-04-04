it.each([
    {
        input: 0,
        want: 0,
    },
])('todo - %#', ({ input, want }) => {
    expect(input).toEqual(want);
});
