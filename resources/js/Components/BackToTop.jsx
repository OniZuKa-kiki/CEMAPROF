import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { smoothScrollToTop } from '@/lib/smoothScroll';

export default function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => setVisible(window.scrollY > 400);
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <button
            type="button"
            onClick={() => smoothScrollToTop(800)}
            className={cn('back-to-top', visible && 'visible')}
            aria-label="Retour en haut"
        >
            <ArrowUp className="h-5 w-5" />
        </button>
    );
}
