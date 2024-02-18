import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { Dispatch, OlHTMLAttributes, SetStateAction } from 'react';

export interface Item {
    name: string;
}

export interface ListboxContextValue {
    items: Item[];
    activeIndex: number;
    onActiveChange: (index: number) => void;
    selected: Set<number>;
    onSelectChange: (index: number) => void;
}

const ListboxContext = createContext<ListboxContextValue | undefined>(undefined);

export interface ListboxProps extends OlHTMLAttributes<HTMLUListElement> {
    items: Item[];
    selected: Set<number>;
    onSelectChange: Dispatch<SetStateAction<Set<number>>>;
}
export function ListboxProvider({
    items,
    selected,
    onSelectChange: onSelectChangeExternal,
    ...rest
}: ListboxProps) {
    const [activeIndex, setActiveIndex] = useState<number>(-1);

    const onSelectChange = useCallback((index: number) => {
        onSelectChangeExternal((selected) => {
            const next = new Set([...selected]);
            if (next.has(index)) {
                next.delete(index);
            } else {
                next.add(index);
            }
            return next;
        });
    }, []);

    const onActiveChange = useCallback((index: number) => {
        setActiveIndex(() => index);
    }, []);

    const value = useMemo(
        () => ({
            activeIndex,
            onActiveChange,
            items,
            selected,
            onSelectChange,
        }),
        [activeIndex, selected],
    );

    return <ListboxContext.Provider value={value} {...rest} />;
}

export function useListboxContext(): ListboxContextValue {
    const context = useContext(ListboxContext);
    if (context === undefined) {
        throw new Error('useListboxContext must be used within a ListboxProvider');
    }
    return context;
}
