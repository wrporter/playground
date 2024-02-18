import { type PropsWithChildren, memo, useState } from 'react';

import { Listbox, Option } from './listbox';
import { itemOptionVariants } from '../../components/item.option';
import { items } from '../../items';

export function Generic() {
    const [selected, setSelected] = useState<Set<number>>(new Set());

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

            <h2 className="text-lg font-bold my-4" id="ItemLabel">
                Items
            </h2>
            <Listbox
                className="flex flex-wrap gap-4 outline-none"
                aria-labelledby="ItemLabel"
                items={items}
                selected={selected}
                onSelectChange={setSelected}
            >
                {items.map((item, index) => (
                    <Option
                        key={item.name}
                        index={index}
                        className={({ isActive, isSelected }) =>
                            itemOptionVariants({ selected: isSelected, active: isActive })
                        }
                    >
                        <div>{item.name}</div>
                        <div className="w-10 h-2 block" style={{ backgroundColor: item.color }} />
                    </Option>
                ))}
            </Listbox>
        </div>
    );
}

const Chip = memo(({ ...rest }: PropsWithChildren) => {
    return <li className="bg-gray-300 rounded-2xl py-1.5 px-3 text-sm" {...rest} />;
});
