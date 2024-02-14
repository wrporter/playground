import './App.css';
import { items } from './items';

// Implement a feature to allow item selection with the following requirements:
// 1. Clicking an item selects/unselects it.
// 2. Multiple items can be selected at a time.
// 3. Make sure to avoid unnecessary re-renders of each list item in the big list (performance).
// 4. Currently selected items should be visually highlighted.
// 5. Currently selected items' names should be shown at the top of the page.
//
// Feel free to change the component structure at will.

export function App() {
    return (
        <ul className="List">
            {items.map((item) => (
                <li key={item.name} className={`List__item List__item--${item.color}`}>
                    {item.name}
                </li>
            ))}
        </ul>
    );
}
