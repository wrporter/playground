import { useEffect, useState } from 'react';

export interface FilmData {
    title: string;
    episode_id: number;
    opening_crawl: string;
    director: string;
    producer: string;
    release_date: string;
    characters: string[]; // urls
    planets: string[]; // urls
    starships: string[]; // urls
    vehicles: string[]; // urls
    species: string[]; // urls
    created: string;
    edited: string;
    url: string;
}

const cache: Record<string, FilmData> = {};

export function Film({ url }: { url: string }) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error>();
    const [film, setFilm] = useState(cache[url]);

    useEffect(() => {
        setIsLoading(true);
        fetch(url)
            .then((response) => {
                if (response.status >= 400) {
                    setError(new Error(`Failed with status ${response.status}`));
                } else {
                    response
                        .json()
                        .then((data) => {
                            cache[url] = data;
                            setIsLoading(false);
                            setFilm(data);
                        })
                        .catch((error) => setError(error));
                }
            })
            .catch((error) => setError(error));
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>{error.message}</div>;
    }

    return <div>{film.title}</div>;
}
