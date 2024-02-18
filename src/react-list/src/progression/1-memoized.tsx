import { type PropsWithChildren, memo, useCallback, useState } from 'react';

import { itemOptionVariants } from '../components/item.option';
import type { Item } from '../items';
import { items } from '../items';

export function Memoized() {
    const [selected, setSelected] = useState<Set<number>>(new Set());

    const handleSelectChange = useCallback((id: number) => {
        setSelected((selected) => {
            const next = new Set([...selected]);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Selected</h2>
            {selected.size > 0 ? (
                <ul className="flex flex-wrap gap-2">
                    {[...selected].map((id) => (
                        <Chip key={id}>{items[id].name}</Chip>
                    ))}
                </ul>
            ) : (
                <div className="flex items-center h-8 text-gray-500">No items selected</div>
            )}

            <h2 className="text-lg font-bold my-4">Items</h2>
            <ul className="flex flex-wrap gap-4">
                {items.map((item, id) => (
                    <Option
                        key={item.name}
                        id={id}
                        item={item}
                        isSelected={selected.has(id)}
                        onChange={handleSelectChange}
                    />
                ))}
            </ul>
        </div>
    );
}

const Chip = memo(({ ...rest }: PropsWithChildren) => {
    return <li className="bg-gray-300 rounded-2xl py-1.5 px-3 text-sm" {...rest} />;
});

interface OptionProps {
    id: number;
    item: Item;
    isSelected: boolean;
    onChange: (id: number) => void;
}

const Option = memo(({ id, item, isSelected, onChange }: OptionProps) => {
    const handleChange = () => onChange(id);
    const className = itemOptionVariants({ selected: isSelected });

    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
        <li key={item.name} className={className} onClick={handleChange}>
            <span>{item.name}</span>
            <span className="w-10 h-2 block" style={{ backgroundColor: item.color }} />
        </li>
    );
});
