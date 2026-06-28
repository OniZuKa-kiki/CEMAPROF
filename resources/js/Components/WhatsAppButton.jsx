import { usePage } from '@inertiajs/react';
import WhatsAppIcon from '@/Components/WhatsAppIcon';
import { formatWhatsAppUrl } from '@/lib/utils';

export default function WhatsAppButton() {
    const { whatsappNumber, siteSettings } = usePage().props;
    const number = whatsappNumber || siteSettings?.whatsapp || '212600000000';

    const handleClick = () => {
        const message = 'Bonjour CEMAPROF, je souhaite obtenir des informations sur vos produits.';
        window.open(formatWhatsAppUrl(number, message), '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="group relative">
            <div
                className="pointer-events-none absolute bottom-full right-0 z-20 mb-2 whitespace-nowrap rounded-lg bg-[#128C7E] px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
                aria-hidden="true"
            >
                WhatsApp — Discutez avec nous
            </div>
            <button
                type="button"
                onClick={handleClick}
                aria-label="Contacter via WhatsApp"
                className="whatsapp-fab relative"
            >
                <span className="ping-ring" aria-hidden="true" />
                <WhatsAppIcon className="relative z-10 h-7 w-7 text-white" />
            </button>
        </div>
    );
}
