import type { LiHTMLAttributes } from 'react';
import { forwardRef, useCallback, useEffect, useRef } from 'react';

import { useListboxContext } from './listbox-context';
import { mergeRefs } from '../merge-refs';
import { scrollIntoViewIfNeeded } from '../scroll';

export interface OptionProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'className'> {
    index: number;
    className?: (props: { isActive: boolean; isSelected: boolean }) => string;
}

/**
 * Feature enhancements:
 * - Support disabled.
 * - Use controllable state to allow setting isSelected externally. This is if you have a persisted
 * selection state.
 */
export const Option = forwardRef<HTMLLIElement, OptionProps>(
    ({ index, className, ...rest }: OptionProps, externalRef) => {
        const { activeIndex, onActiveChange, selected, onSelectChange } = useListboxContext();

        const handleChange = useCallback(() => onSelectChange(index), []);
        const handleMouseEnter = useCallback(() => onActiveChange(index), []);

        const ref = useRef(null);
        const isSelected = selected.has(index);
        const isActive = index === activeIndex;

        useEffect(() => {
            if (isActive) {
                scrollIntoViewIfNeeded(ref.current);
            }
        }, [isActive]);

        return (
            // Key events are handled via the parent listbox element.
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <li
                ref={mergeRefs([externalRef, ref])}
                role="option"
                id={index.toString()}
                aria-selected={selected.has(index)}
                onClick={handleChange}
                onMouseEnter={handleMouseEnter}
                className={className?.({
                    isActive,
                    isSelected,
                })}
                {...rest}
            />
        );
    },
);
