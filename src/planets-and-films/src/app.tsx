import { useEffect, useState } from 'react';
import { tv } from 'tailwind-variants';

import { Film } from './film';

interface Planet {
    name: string;
    films: string[]; // urls

    rotation_period: string;
    orbital_period: string;
    diameter: string;
    climate: string;
    gravity: string;
    terrain: string;
    surface_water: string;
    population: string;
    residents: string[]; // urls
    created: string;
    edited: string;
    url: string;
}

interface PlanetResponse {
    previous: string;
    next: string;
    count: number;
    results: Planet[];
}

const buttonVariants = tv({
    base: ['rounded p-2 text-white'],
    variants: {
        disabled: {
            true: ['bg-gray-400', 'cursor-not-allowed'],
            false: ['bg-blue-500 hover:bg-blue-600 active:bg-blue-700', 'cursor-pointer'],
        },
    },
    defaultVariants: {
        disabled: false,
    },
});

export function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error>();
    const [planets, setPlanets] = useState<Planet[]>([]);
    const [page, setPage] = useState('https://swapi.py4e.com/api/planets');
    const [pageNum, setPageNum] = useState(1);
    const [next, setNext] = useState<string | null>(null);
    const [previous, setPrevious] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        fetch(page)
            .then((response) => {
                if (response.status >= 400) {
                    setError(new Error(`Failed with status ${response.status}`));
                } else {
                    response
                        .json()
                        .then((data: PlanetResponse) => {
                            setIsLoading(false);
                            setPlanets(data.results);
                            setNext(data.next);
                            setPrevious(data.previous);
                        })
                        .catch((error) => setError(error));
                }
            })
            .catch((error) => setError(error));
    }, [page]);

    const handlePrevious = () => {
        if (previous && !isLoading) {
            setPage(previous);
            setPageNum(pageNum - 1);
        }
    };
    const handleNext = () => {
        if (next && !isLoading) {
            setPage(next);
            setPageNum(pageNum + 1);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>{error.message}</div>;
    }

    return (
        <div className="w-96 m-4">
            <table className="border-collapse table-auto w-full text-sm">
                <thead>
                    <tr>
                        <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
                            Planet
                        </th>
                        <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
                            First Film Appearance
                        </th>
                    </tr>
                </thead>

                <tbody className="bg-white dark:bg-slate-800">
                    {planets.map(({ url, name, films }) => (
                        <tr key={url}>
                            <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
                                {name}
                            </td>
                            <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
                                {films.length === 0 ? <div>N/A</div> : <Film url={films[0]} />}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-between items-center mt-2">
                <button
                    className={buttonVariants({ disabled: !previous })}
                    type="button"
                    onClick={handlePrevious}
                    disabled={!previous}
                >
                    {'< Previous'}
                </button>

                <div>{pageNum}</div>

                <button
                    className={buttonVariants({ disabled: !next })}
                    type="button"
                    onClick={handleNext}
                    disabled={!next}
                >
                    {'Next >'}
                </button>
            </div>
        </div>
    );
}
