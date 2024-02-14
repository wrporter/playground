// ---------------------------------------
// Do NOT change anything below this line.
// ---------------------------------------

export interface Item {
    name: string;
    color: string;
}

const sizes = ['tiny', 'small', 'medium', 'large', 'huge'];
const colors = [
    'navy',
    'blue',
    'aqua',
    'teal',
    'olive',
    'green',
    'lime',
    'yellow',
    'orange',
    'red',
    'maroon',
    'fuchsia',
    'purple',
    'silver',
    'gray',
    'black',
];
const fruits = [
    'apple',
    'banana',
    'watermelon',
    'orange',
    'peach',
    'tangerine',
    'pear',
    'kiwi',
    'mango',
    'pineapple',
];

export const items: Item[] = sizes.reduce(
    (items, size) => [
        ...items,
        ...fruits.reduce(
            (acc, fruit) => [
                ...acc,
                ...colors.reduce(
                    (acc, color) => [
                        ...acc,
                        {
                            name: `${size} ${color} ${fruit}`,
                            color,
                        },
                    ],
                    [] as Item[],
                ),
            ],
            [] as Item[],
        ),
    ],
    [] as Item[],
);
