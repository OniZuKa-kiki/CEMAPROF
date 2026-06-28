import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { formatWhatsAppUrl } from '@/lib/utils';

export default function PageCta({
    eyebrow = 'Devis personnalisé',
    title = 'Un projet ? Parlons-en.',
    description = 'Notre équipe technique vous répond sous 24h et établit un devis sur mesure, sans engagement.',
    contactHref = '/contact?subject=devis',
    whatsappMessage = 'Bonjour CEMAPROF, je souhaite un devis personnalisé.',
}) {
    const { whatsappNumber, siteSettings } = usePage().props;
    const phone = siteSettings?.phone;

    return (
        <section className="cta-dark relative overflow-hidden section-py reveal-on-scroll">
            <div className="cta-geo-lines" aria-hidden="true">
                <div className="cta-geo-line cta-geo-line--1" />
                <div className="cta-geo-line cta-geo-line--2" />
                <div className="cta-geo-line cta-geo-line--3" />
            </div>
            <div className="cta-blob cta-blob--blue" />
            <div className="cta-blob cta-blob--red" />

            <div className="relative container-tight z-10 text-center">
                <span className="cta-eyebrow">{eyebrow}</span>
                <h2 className="heading-fluid mt-4 font-bold text-white">{title}</h2>
                <p className="body-lg mx-auto mt-5 max-w-lg text-white/60">{description}</p>
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button variant="white" size="lg" asChild>
                        <Link href={contactHref}>
                            Contactez-nous
                            <ArrowRight className="ml-1.5 h-4 w-4" />
                        </Link>
                    </Button>
                    {phone && (
                        <a
                            href={formatWhatsAppUrl(whatsappNumber, whatsappMessage)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="whatsapp-pill"
                        >
                            <MessageCircle className="h-5 w-5 fill-white" />
                            {phone}
                        </a>
                    )}
                </div>
            </div>
        </section>
    );
}
