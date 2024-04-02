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

const cache: Record<string, Promise<FilmData>> = {};

export function Film({ url }: { url: string }) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error>();
    const [film, setFilm] = useState<FilmData>();

    useEffect(() => {
        if (!cache[url]) {
            setIsLoading(true);
            cache[url] = fetch(url)
                .then((response) => {
                    if (response.status >= 400) {
                        setError(new Error(`Failed with status ${response.status}`));
                        delete cache[url];
                        return undefined;
                    }
                    return response
                        .json()
                        .then((data) => {
                            cache[url] = Promise.resolve(data);
                            setIsLoading(false);
                            setFilm(data);
                            return data;
                        })
                        .catch(setError);
                })
                .catch(setError);
        } else {
            cache[url].then((data) => {
                setFilm(data);
                setIsLoading(false);
            });
        }
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>{error.message}</div>;
    }
    if (film) {
        return <div>{film.title}</div>;
    }
}
