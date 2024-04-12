import { ACTIVITIES } from './data';
import type { Activity } from './types';

type FetchActivitiesArgs = {
    page: number;
    // TODO
};

type FetchActivitiesResponse = {
    data: Activity[];
};

const PAGE_SIZE = 2;

export function fetchActivities(args: FetchActivitiesArgs): Promise<FetchActivitiesResponse> {
    console.log('fetchActivities', args);

    const start = args.page * PAGE_SIZE;
    const data = ACTIVITIES.slice(start, start + PAGE_SIZE);

    const result: FetchActivitiesResponse = {
        data,
    };

    return new Promise((resolve) =>
        setTimeout(() => resolve(result), Math.floor(Math.random() * 1000)),
    );
}
