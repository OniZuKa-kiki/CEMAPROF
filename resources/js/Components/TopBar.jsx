import { usePage } from '@inertiajs/react';
import { MessageCircle, Truck } from 'lucide-react';
import { formatWhatsAppDisplay, formatWhatsAppUrl } from '@/lib/utils';

export default function TopBar() {
    const { whatsappNumber, siteSettings } = usePage().props;
    const number = whatsappNumber || siteSettings?.whatsapp || '212600000000';
    const display = formatWhatsAppDisplay(number);

    return (
        <div className="site-topbar">
            <div className="site-topbar__inner">
                <p className="site-topbar__promo">
                    <Truck className="site-topbar__icon" aria-hidden="true" />
                    <span className="site-topbar__promo-short">Importateur · Distributeur · Casablanca</span>
                    <span className="site-topbar__promo-full">Livraison partout au Maroc · Devis personnalisé sous 24h</span>
                </p>
                <a
                    href={formatWhatsAppUrl(number, 'Bonjour CEMAPROF')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="site-topbar__whatsapp"
                >
                    <MessageCircle className="site-topbar__icon" aria-hidden="true" />
                    <span className="site-topbar__whatsapp-label">WhatsApp :</span>
                    <strong>{display}</strong>
                </a>
            </div>
        </div>
    );
}
