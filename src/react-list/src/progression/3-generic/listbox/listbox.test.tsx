import { render, screen } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import userEvent from '@testing-library/user-event';
import { useEffect, useState } from 'react';

import { Listbox, Option } from '.';

const items = [{ name: 'One' }, { name: 'Two' }, { name: 'Three' }];

interface TestComponentProps {
    onChange?: (selected: Set<number>) => void;
}

function TestComponent({ onChange }: TestComponentProps) {
    const [selected, setSelected] = useState<Set<number>>(new Set());

    useEffect(() => {
        onChange?.(selected);
    }, [selected]);

    return (
        <Listbox items={items} selected={selected} onSelectChange={setSelected}>
            {items.map((item, index) => (
                <Option key={item.name} index={index}>
                    {item.name}
                </Option>
            ))}
        </Listbox>
    );
}

let user: UserEvent;
beforeEach(() => {
    user = userEvent.setup();
});

it('activates the first non-selected option when focused', async () => {
    render(<TestComponent />);

    const listbox = screen.getByRole('listbox');
    await user.tab();

    expect(listbox).toHaveAttribute('aria-activedescendant', '0');
    await user.tab();
    expect(listbox).not.toHaveAttribute('aria-activedescendant');
});

it('activates an option when the mouse enters it', async () => {
    render(<TestComponent />);

    const listbox = screen.getByRole('listbox');
    const options = screen.getAllByRole('option');
    await user.hover(options[2]);

    expect(listbox).toHaveAttribute('aria-activedescendant', '2');
    await user.unhover(options[2]);
    expect(listbox).not.toHaveAttribute('aria-activedescendant');
});

it('activates next options when the ArrowRight key is pressed', async () => {
    render(<TestComponent />);

    const listbox = screen.getByRole('listbox');
    await user.tab();
    await user.type(listbox, '{arrowright}');

    expect(listbox).toHaveAttribute('aria-activedescendant', '1');
    await user.type(listbox, '{arrowright}');
    expect(listbox).toHaveAttribute('aria-activedescendant', '2');
    // Remains on the last item
    await user.type(listbox, '{arrowright}');
    expect(listbox).toHaveAttribute('aria-activedescendant', '2');
});

it('activates previous options when the ArrowLeft key is pressed', async () => {
    render(<TestComponent />);

    const listbox = screen.getByRole('listbox');
    await user.tab();
    await user.type(listbox, '{end}');
    await user.type(listbox, '{arrowleft}');

    expect(listbox).toHaveAttribute('aria-activedescendant', '1');
    await user.type(listbox, '{arrowleft}');
    expect(listbox).toHaveAttribute('aria-activedescendant', '0');
    // Remains on the first item
    await user.type(listbox, '{arrowleft}');
    expect(listbox).toHaveAttribute('aria-activedescendant', '0');
});

it('activates the last option when the End key is pressed', async () => {
    render(<TestComponent />);

    const listbox = screen.getByRole('listbox');
    await user.tab();
    await user.type(listbox, '{end}');

    expect(listbox).toHaveAttribute('aria-activedescendant', '2');
});

it('activates the first option when the Home key is pressed', async () => {
    render(<TestComponent />);

    const listbox = screen.getByRole('listbox');
    await user.tab();
    await user.type(listbox, '{end}');
    await user.type(listbox, '{home}');

    expect(listbox).toHaveAttribute('aria-activedescendant', '0');
});

it('activates the first selected option when focused', async () => {
    render(<TestComponent />);

    const listbox = screen.getByRole('listbox');
    const options = screen.getAllByRole('option');
    await user.click(options[2]);
    await user.tab({ shift: true });

    expect(listbox).not.toHaveAttribute('aria-activedescendant');
    await user.tab();

    expect(listbox).toHaveAttribute('aria-activedescendant', '2');
});

it('activates the first option that starts with the typed character', async () => {
    render(<TestComponent />);

    const listbox = screen.getByRole('listbox');
    await user.tab();
    await user.keyboard('{t}');

    expect(listbox).toHaveAttribute('aria-activedescendant', '1');
});

it('selects the active option when the Space key is pressed', async () => {
    const mockOnChange = vi.fn();
    render(<TestComponent onChange={mockOnChange} />);

    await user.tab();
    await user.keyboard('[Space]');

    expect(mockOnChange).toHaveBeenCalledWith(new Set([0]));
    expect(screen.getByRole('option', { name: /One/, selected: true })).toBeInTheDocument();
});

it('selects the active option when the Enter key is pressed', async () => {
    const mockOnChange = vi.fn();
    render(<TestComponent onChange={mockOnChange} />);

    await user.tab();
    await user.keyboard('{arrowright}{enter}');

    expect(mockOnChange).toHaveBeenCalledWith(new Set([1]));
    expect(screen.getByRole('option', { name: /Two/, selected: true })).toBeInTheDocument();
});

it('selects an option when clicked', async () => {
    const mockOnChange = vi.fn();
    render(<TestComponent onChange={mockOnChange} />);

    const options = screen.getAllByRole('option');
    await user.click(options[2]);

    expect(mockOnChange).toHaveBeenCalledWith(new Set([2]));
    expect(screen.getByRole('option', { name: /Three/, selected: true })).toBeInTheDocument();
});

it('allows multiple options to be selected at the same time', async () => {
    const mockOnChange = vi.fn();
    render(<TestComponent onChange={mockOnChange} />);

    const options = screen.getAllByRole('option');
    await user.click(options[0]);
    await user.click(options[2]);

    expect(mockOnChange).toHaveBeenCalledWith(new Set([0, 2]));
    expect(screen.getByRole('option', { name: /One/, selected: true })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Three/, selected: true })).toBeInTheDocument();
});

it('deselects selected items', async () => {
    const mockOnChange = vi.fn();
    render(<TestComponent onChange={mockOnChange} />);

    const options = screen.getAllByRole('option');
    await user.click(options[0]);
    expect(screen.getByRole('option', { name: /One/, selected: true })).toBeInTheDocument();

    await user.click(options[0]);
    expect(screen.getByRole('option', { name: /One/, selected: false })).toBeInTheDocument();
    expect(mockOnChange).toHaveBeenCalledWith(new Set());
});
