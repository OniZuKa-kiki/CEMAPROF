/**
 * Prevents horizontal layout shift when the scrollbar toggles or
 * when Radix/react-remove-scroll compensates for it on open dropdowns.
 */
export function initLayoutShiftFix() {
    if (typeof window === 'undefined') {
        return;
    }

    const updateScrollbarWidth = () => {
        const width = window.innerWidth - document.documentElement.clientWidth;
        document.documentElement.style.setProperty('--scrollbar-width', `${width}px`);
    };

    const neutralizeScrollLock = () => {
        document.body.style.removeProperty('margin-right');
        document.body.style.removeProperty('padding-right');

        document.querySelectorAll('.right-scroll-bar-position, .width-before-scroll-bar, .with-scroll-bars-hidden').forEach((node) => {
            node.style.removeProperty('right');
            node.style.removeProperty('margin-right');
            node.style.removeProperty('padding-right');
        });
    };

    updateScrollbarWidth();
    window.addEventListener('resize', updateScrollbarWidth, { passive: true });

    const observer = new MutationObserver(() => {
        updateScrollbarWidth();
        if (document.body.hasAttribute('data-scroll-locked')) {
            neutralizeScrollLock();
            requestAnimationFrame(neutralizeScrollLock);
        }
    });

    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['data-scroll-locked', 'style', 'class'],
    });

    document.querySelectorAll('header, main').forEach((node) => {
        observer.observe(node, {
            attributes: true,
            attributeFilter: ['class', 'style'],
            subtree: true,
        });
    });
}
