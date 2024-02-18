import { useState } from 'react';

import { itemOptionVariants } from '../components/item.option';
import { items } from '../items';

export function Simple() {
    // JavaScript Sets maintain insertion order
    const [selected, setSelected] = useState<Set<number>>(new Set());

    const handleSelectChange = (id: number) => () => {
        setSelected((selected) => {
            const next = new Set([...selected]);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Selected</h2>
            {selected.size > 0 ? (
                <ul className="flex flex-wrap gap-2">
                    {[...selected].map((id) => (
                        <li key={id} className="bg-gray-200 rounded-2xl py-1.5 px-3 text-sm">
                            {items[id].name}
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="flex items-center h-8 text-gray-500">No items selected</div>
            )}

            <h2 className="text-lg font-bold my-4">Items</h2>
            <ul className="flex flex-wrap gap-4">
                {items.map((item, id) => {
                    const isSelected = selected.has(id);
                    const className = itemOptionVariants({ selected: isSelected });

                    return (
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
                        <li key={item.name} className={className} onClick={handleSelectChange(id)}>
                            <span>{item.name}</span>
                            <span
                                className="w-10 h-2 block"
                                style={{ backgroundColor: item.color }}
                            />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
