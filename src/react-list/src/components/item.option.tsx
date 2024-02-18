import { tv } from 'tailwind-variants';

export const itemOptionVariants = tv({
    base: [
        'bg-gray-200 hover:bg-gray-300 active:bg-gray-400',
        'flex flex-col p-2 items-center rounded cursor-pointer',
    ],
    variants: {
        selected: {
            true: 'bg-blue-200 hover:bg-blue-300 active:bg-blue-400',
        },
        active: {
            true: 'ring ring-offset-2',
        },
    },
    defaultVariants: {
        selected: false,
        active: false,
    },
});
