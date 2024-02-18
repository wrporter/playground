export function scrollIntoViewIfNeeded(element: HTMLElement | null): undefined {
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
