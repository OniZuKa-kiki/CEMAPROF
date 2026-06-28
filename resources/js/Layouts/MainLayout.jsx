import { useEffect, useState } from 'react';
import TopBar from "@/Components/TopBar";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import FloatingActions from "@/Components/FloatingActions";
import QuoteCartBar from "@/Components/QuoteCartBar";
import { cn } from '@/lib/utils';

const SCROLL_COMPACT_THRESHOLD = 48;

export default function Layout({ children }) {
    const [compactHeader, setCompactHeader] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setCompactHeader(window.scrollY > SCROLL_COMPACT_THRESHOLD);
        };

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div className={cn(
            'site-shell flex min-h-screen flex-col',
            compactHeader && 'site-shell--compact',
        )}>
            <TopBar />
            <Navbar />
            <main className="site-main flex-1">{children}</main>
            <Footer />
            <QuoteCartBar />
            <FloatingActions />
        </div>
    );
}
