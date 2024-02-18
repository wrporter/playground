import type { KeyboardEvent, PropsWithChildren } from 'react';
import { forwardRef, useRef } from 'react';

import type { ListboxProps } from './listbox-context';
import { ListboxProvider, useListboxContext } from './listbox-context';
import { mergeRefs } from '../merge-refs';

/**
 * The following are ways we can improve customization.
 * - Use polymorphic components to customize the element type.
 * - Abstract via hooks to support broader customization.
 * - Use something like @reach/descendants to support component composition.
 * - Add support for single select.
 * - Add support for custom keyboard events on options. For example, Delete/Backspace to remove an
 * item from a list. We could add this behavior to the chips, for example.
 *
 * Possible improvements:
 * - Support vertical orientations with Up and Down arrow keys.
 * - Support select all (Ctrl + A).
 * - Type multiple characters in rapid succession to get detailed match.
 *
 * TODO:
 * - Modifying the activeIndex causes all options to re-render, but we should only have to
 * re-render the previously selected index and the new one. Can we also accomplish the same with
 * selection? All options are re-rendered upon selection in
 * https://react-spectrum.adobe.com/react-aria/ListBox.html and
 * https://nextui.org/docs/components/listbox.
 * - How can we avoid having to pass in the items? This is to prevent overflowing the activeIndex
 * when moving to the end of the list. We also use it to determine the activeIndex for type-ahead
 * behavior.
 * - Add unit tests to avoid regressions.
 */
export const InternalListbox = forwardRef<HTMLUListElement, PropsWithChildren>(
    ({ ...rest }, externalRef) => {
        const { items, activeIndex, onActiveChange, selected, onSelectChange } =
            useListboxContext();
        const ref = useRef<HTMLUListElement>(null);

        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'ArrowLeft':
                    event.preventDefault();
                    onActiveChange(Math.max(0, activeIndex - 1));
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    onActiveChange(Math.min(items.length - 1, activeIndex + 1));
                    break;
                case 'Home':
                    event.preventDefault();
                    onActiveChange(0);
                    break;
                case 'End':
                    event.preventDefault();
                    onActiveChange(items.length - 1);
                    break;
                case ' ':
                    event.preventDefault();
                    onSelectChange(activeIndex);
                    break;
                case 'Enter':
                    onSelectChange(activeIndex);
                    break;
                default:
                    // eslint-disable-next-line no-case-declarations
                    const character = event.key.toLocaleLowerCase();
                    if (
                        character.length === 1 &&
                        character.charCodeAt(0) >= 'a'.charCodeAt(0) &&
                        character.charCodeAt(0) <= 'z'.charCodeAt(0)
                    ) {
                        onActiveChange(
                            items.findIndex(
                                (item) => item.name.toLocaleLowerCase()[0] === character,
                            ),
                        );
                    }
            }
        };

        const handleFocus = () => {
            const indexes = [...selected].sort((a, b) => a - b);
            if (indexes.length > 0) {
                onActiveChange(indexes[0]);
            } else {
                onActiveChange(0);
            }
        };

        const handleMouseEnter = () => ref.current?.focus({ preventScroll: true });
        const handleLeave = () => onActiveChange(-1);

        return (
            <ul
                ref={mergeRefs([ref, externalRef])}
                role="listbox"
                tabIndex={0}
                aria-multiselectable
                aria-activedescendant={activeIndex.toString()}
                onKeyDown={handleKeyDown}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleLeave}
                onBlur={handleLeave}
                onFocus={handleFocus}
                {...rest}
            />
        );
    },
);

export const Listbox = forwardRef<HTMLUListElement, ListboxProps>(
    ({ items, selected, onSelectChange, ...rest }, ref) => {
        return (
            <ListboxProvider items={items} selected={selected} onSelectChange={onSelectChange}>
                <InternalListbox ref={ref} {...rest} />
            </ListboxProvider>
        );
    },
);
