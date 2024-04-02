export function getPeople(
    input: string[][],
    labels: string[],
    notLabels: string[] = [],
    // For generic filtering, we could provide a better data structure, such as the following:
    // filters: Record<string, { in: boolean; values: string[] }>
): string[] {
    // How would you optimize lookups?
    // - Create a map of labels to people, then when filtering, combine the lists of people into
    // Sets to ensure uniqueness and to more quickly union and difference between them for filters.
    // - Stream process one record at a time during a file upload, so we don't keep all the data in
    // memory at the same time.

    const headers = input[0];
    const records = input.slice(1).map((record) => {
        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
            row[header] = record[index];
        });
        return row;
    });

    return records
        .filter((record) => {
            const recordLabels = new Set(record.labels.split(/\s*,\s*/));
            return (
                labels.every((label) => recordLabels.has(label)) &&
                !notLabels.some((label) => recordLabels.has(label))
            );
        })
        .map(({ name }) => name);
}
