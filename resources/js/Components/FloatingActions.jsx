import BackToTop from '@/Components/BackToTop';
import WhatsAppButton from '@/Components/WhatsAppButton';

export default function FloatingActions() {
    return (
        <div className="floating-actions-dock" aria-label="Actions rapides">
            <BackToTop />
            <WhatsAppButton />
        </div>
    );
}
