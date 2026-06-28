import { useEffect, useState } from 'react';

const FOOTER_GAP = 6;

function getDefaultBottom() {
    return window.matchMedia('(min-width: 640px)').matches ? 32 : 24;
}

export function useAboveFooterOffset(deps = []) {
    const [bottom, setBottom] = useState(getDefaultBottom);

    useEffect(() => {
        const footer = document.querySelector('[data-site-footer]');
        if (!footer) {
            return undefined;
        }

        const update = () => {
            const rect = footer.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const defaultBottom = getDefaultBottom();

            if (rect.top < viewportHeight && rect.bottom > 0) {
                setBottom(Math.max(defaultBottom, viewportHeight - rect.top + FOOTER_GAP));
                return;
            }

            setBottom(defaultBottom);
        };

        update();

        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);

        return () => {
            window.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
        };
    }, deps);

    return bottom;
}
