import React from 'react';

import type { Activity } from './api';
import { fetchActivities } from './api';
import { Button, Card, Heading, List, ListItem } from './components';

export function App() {
    const [page, setPage] = React.useState(0);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState();
    const [activities, setActivities] = React.useState<Activity[]>([]);
    const [areNoMoreActivities, setAreNoMoreActivities] = React.useState(false);

    React.useEffect(() => {
        setLoading(true);
        fetchActivities({ page })
            .then(({ data }) => {
                if (data.length === 0) {
                    setAreNoMoreActivities(true);
                }
                setActivities((prevActivities) => [...prevActivities, ...data]);
            })
            .catch((error) => {
                setError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [page]);

    const handleShowMore = () => {
        if (!loading) {
            setPage(page + 1);
        }
    };

    return (
        <Card>
            <Heading>Your Upcoming Activities</Heading>

            {loading ? 'Loading...' : null}
            {error || null}

            {activities.length > 0 ? (
                <List>
                    {activities.map(({ uid, activityTitle, startTime, endTime }) => (
                        <ListItem key={uid}>
                            <div>{activityTitle}</div>
                            <div>Start Time: {startTime.toLocaleString()}</div>
                            {endTime ? <div>End Time: {endTime.toLocaleString()}</div> : null}
                        </ListItem>
                    ))}
                </List>
            ) : null}

            <div>
                <Button onClick={handleShowMore} disabled={areNoMoreActivities || loading}>
                    Show More
                </Button>
            </div>
        </Card>
    );
}
