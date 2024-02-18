import {
    type KeyboardEvent,
    type PropsWithChildren,
    memo,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import { itemOptionVariants } from '../components/item.option';
import type { Item } from '../items';
import { items } from '../items';

export function Accessible() {
    const [selected, setSelected] = useState<Set<number>>(new Set());
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const ref = useRef<HTMLUListElement>(null);

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

    const handleActiveChange = useCallback((id: number) => {
        setActiveIndex(() => id);
    }, []);

    const handleKeyDown = (event: KeyboardEvent) => {
        // Possible improvements:
        // - Support vertical orientations with Up and Down arrow keys.
        // - Support select all (Ctrl + A).
        // - Type multiple characters in rapid succession to get detailed match.
        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                setActiveIndex(Math.max(0, activeIndex - 1));
                break;
            case 'ArrowRight':
                event.preventDefault();
                setActiveIndex(Math.min(items.length - 1, activeIndex + 1));
                break;
            case 'Home':
                event.preventDefault();
                setActiveIndex(0);
                break;
            case 'End':
                event.preventDefault();
                setActiveIndex(items.length - 1);
                break;
            case ' ':
                event.preventDefault();
                handleSelectChange(activeIndex);
                break;
            case 'Enter':
                handleSelectChange(activeIndex);
                break;
            default:
                // eslint-disable-next-line no-case-declarations
                const character = event.key.toLocaleLowerCase();
                if (
                    character.length === 1 &&
                    character.charCodeAt(0) >= 'a'.charCodeAt(0) &&
                    character.charCodeAt(0) <= 'z'.charCodeAt(0)
                ) {
                    setActiveIndex(
                        items.findIndex((item) => item.name.toLocaleLowerCase()[0] === character),
                    );
                }
        }
    };

    const handleFocus = () => {
        const indexes = [...selected].sort((a, b) => a - b);
        if (indexes.length > 0) {
            setActiveIndex(indexes[0]);
        } else {
            setActiveIndex(0);
        }
    };

    const handleMouseEnter = () => ref.current?.focus({ preventScroll: true });
    const handleLeave = () => setActiveIndex(-1);

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
            <ul
                ref={ref}
                className="flex flex-wrap gap-4 outline-none"
                role="listbox"
                tabIndex={0}
                aria-labelledby="ItemLabel"
                aria-multiselectable
                aria-activedescendant={activeIndex.toString()}
                onKeyDown={handleKeyDown}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleLeave}
                onBlur={handleLeave}
                onFocus={handleFocus}
            >
                {items.map((item, id) => (
                    <Option
                        key={item.name}
                        id={id}
                        item={item}
                        isSelected={selected.has(id)}
                        isActive={activeIndex === id}
                        onChange={handleSelectChange}
                        onActivate={handleActiveChange}
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
    isActive: boolean;
    onChange: (id: number) => void;
    onActivate: (id: number) => void;
}

const Option = memo(({ id, item, isSelected, isActive, onChange, onActivate }: OptionProps) => {
    const handleChange = () => onChange(id);
    const className = itemOptionVariants({ selected: isSelected, active: isActive });
    const handleMouseEnter = () => {
        onActivate(id);
    };

    const ref = useRef(null);
    useEffect(() => {
        if (isActive) {
            scrollIntoViewIfNeeded(ref.current);
        }
    }, [isActive]);

    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
        <li
            ref={ref}
            key={item.name}
            role="option"
            className={className}
            aria-selected={isSelected}
            onClick={handleChange}
            onMouseEnter={handleMouseEnter}
        >
            <span>{item.name}</span>
            <span className="w-10 h-2 block" style={{ backgroundColor: item.color }} />
        </li>
    );
});

function scrollIntoViewIfNeeded(element: HTMLElement | null): undefined {
    if (!element) {
        return;
    }

    if (element.getBoundingClientRect().bottom > window.innerHeight) {
        element.scrollIntoView(false);
    }

    if (element.getBoundingClientRect().top < 0) {
        element.scrollIntoView();
    }
}
