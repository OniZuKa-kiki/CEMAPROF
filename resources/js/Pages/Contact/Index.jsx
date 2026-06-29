import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { Clock, Mail, MapPin, MessageCircle, Package, Phone, Send, Truck, User } from 'lucide-react';
import { FacebookIcon, InstagramIcon, LinkedInIcon } from '@/Components/SocialIcons';
import MainLayout from '@/Layouts/MainLayout';
import QuoteProductsField from '@/Components/QuoteProductsField';
import PageCta from '@/Components/PageCta';
import { PageHero } from '@/Components/PageHero';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Label } from '@/Components/ui/label';
import FormSelect from '@/Components/FormSelect';
import { useToast } from '@/Components/ui/use-toast';
import { subjectOptions, formatWhatsAppUrl } from '@/lib/utils';
import { useQuoteCart } from '@/hooks/useQuoteCart';

const deliveryModeOptions = [
    { value: 'livraison', label: 'Livraison au Maroc' },
    { value: 'retrait', label: 'Retrait à Casablanca' },
    { value: 'a_preciser', label: 'À préciser avec vous' },
];

function buildDefaultMessage(products) {
    if (!products?.length) {
        return '';
    }

    const formatLine = (product) => {
        const qty = product.quantity > 1 ? ` (quantité : ${product.quantity})` : '';
        const price = product.price != null ? ` — ${product.price} MAD / unité` : '';

        return `- ${product.name}${qty}${price}`;
    };

    if (products.length === 1) {
        const product = products[0];
        return `Bonjour, je souhaite commander / obtenir un devis pour :\n${formatLine(product)}`;
    }

    return `Bonjour, je souhaite commander / obtenir un devis pour les produits suivants :\n${products.map(formatLine).join('\n')}`;
}

function ContactFormSection({ icon: Icon, title, children }) {
    return (
        <section className="contact-form-section">
            <div className="contact-form-section__head">
                <span className="contact-form-section__icon" aria-hidden="true">
                    <Icon className="h-4 w-4" />
                </span>
                <h3 className="contact-form-section__title">{title}</h3>
            </div>
            <div className="contact-form-section__body">{children}</div>
        </section>
    );
}

function ContactForm({ quoteProducts = [], prefilledSubject }) {
    const { toast } = useToast();
    const { items, setItemsFromList, removeItem, clearCart } = useQuoteCart();
    const messageInitialized = useRef(false);

    useEffect(() => {
        if (quoteProducts.length) {
            setItemsFromList(quoteProducts);
        }
    }, [quoteProducts, setItemsFromList]);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        delivery_city: '',
        delivery_mode: 'a_preciser',
        delivery_notes: '',
        subject: prefilledSubject || (quoteProducts.length ? 'devis' : 'devis'),
        product_slug: '',
        product_slugs: [],
        message: '',
        website: '',
    });

    useEffect(() => {
        const slugs = items.map((item) => item.slug);
        setData((current) => ({
            ...current,
            product_slugs: slugs,
            product_slug: slugs[0] || '',
            subject: slugs.length ? 'devis' : current.subject,
        }));

        if (items.length && !messageInitialized.current) {
            messageInitialized.current = true;
            setData('message', buildDefaultMessage(items));
        }
    }, [items, setData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/contact', {
            preserveScroll: true,
            onSuccess: () => {
                clearCart();
                messageInitialized.current = false;
                reset();
                toast({
                    title: 'Message envoyé !',
                    description: 'Nous vous répondrons sous 24h.',
                    variant: 'success',
                });
            },
        });
    };

    const isQuote = data.subject === 'devis' || items.length > 0;

    return (
        <div className="contact-form-card">
            <div className="contact-form-card__header">
                <h2 className="contact-form-card__title">Envoyez-nous un message</h2>
                <p className="contact-form-card__subtitle">
                    Réponse sous 24h ouvrées. Les détails de livraison pourront être affinés ensemble.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="contact-form-card__form">
                <div className="honeypot-field" aria-hidden="true">
                    <label htmlFor="website">Ne pas remplir</label>
                    <input
                        type="text"
                        id="website"
                        name="website"
                        value={data.website}
                        onChange={(e) => setData('website', e.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                    />
                </div>

                <ContactFormSection icon={User} title="Vos coordonnées">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nom complet *</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Votre nom"
                            />
                            {errors.name && <p className="text-sm text-accent">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="votre@email.com"
                            />
                            {errors.email && <p className="text-sm text-accent">{errors.email}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Téléphone</Label>
                            <Input
                                id="phone"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="+212 6 XX XX XX XX"
                            />
                            {errors.phone && <p className="text-sm text-accent">{errors.phone}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company">Entreprise</Label>
                            <Input
                                id="company"
                                value={data.company}
                                onChange={(e) => setData('company', e.target.value)}
                                placeholder="Nom de votre entreprise"
                            />
                        </div>
                    </div>
                </ContactFormSection>

                <ContactFormSection icon={Package} title="Votre demande">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="subject">Sujet *</Label>
                            <FormSelect
                                id="subject"
                                value={String(data.subject ?? 'devis')}
                                onValueChange={(value) => setData('subject', value)}
                                options={subjectOptions}
                                placeholder="Choisir un sujet"
                            />
                            {errors.subject && <p className="text-sm text-accent">{errors.subject}</p>}
                        </div>

                        {items.length > 0 ? (
                            <QuoteProductsField
                                items={items}
                                onRemove={removeItem}
                                onClearAll={clearCart}
                            />
                        ) : (
                            <div className="space-y-2">
                                <Label htmlFor="product_slug">Produit concerné</Label>
                                <Input
                                    id="product_slug"
                                    value={data.product_slug}
                                    onChange={(e) => setData('product_slug', e.target.value)}
                                    placeholder="Référence ou nom du produit"
                                />
                            </div>
                        )}
                    </div>
                </ContactFormSection>

                {isQuote && (
                    <ContactFormSection icon={Truck} title="Expédition (indicatif)">
                        <p className="contact-form-section__hint">
                            Ces informations nous aident à préparer votre devis. Nous affinerons ensemble les détails après votre demande.
                        </p>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="delivery_mode">Mode souhaité</Label>
                                <FormSelect
                                    id="delivery_mode"
                                    value={String(data.delivery_mode ?? 'a_preciser')}
                                    onValueChange={(value) => setData('delivery_mode', value)}
                                    options={deliveryModeOptions}
                                    placeholder="Choisir un mode"
                                />
                                {errors.delivery_mode && <p className="text-sm text-accent">{errors.delivery_mode}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="delivery_city">Ville de livraison</Label>
                                <Input
                                    id="delivery_city"
                                    value={data.delivery_city}
                                    onChange={(e) => setData('delivery_city', e.target.value)}
                                    placeholder="Ex. Casablanca, Marrakech…"
                                />
                                {errors.delivery_city && <p className="text-sm text-accent">{errors.delivery_city}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="delivery_notes">Note rapide</Label>
                                <Input
                                    id="delivery_notes"
                                    value={data.delivery_notes}
                                    onChange={(e) => setData('delivery_notes', e.target.value)}
                                    placeholder="Urgent, accès chantier, etc."
                                />
                                {errors.delivery_notes && <p className="text-sm text-accent">{errors.delivery_notes}</p>}
                            </div>
                        </div>
                    </ContactFormSection>
                )}

                <ContactFormSection icon={MessageCircle} title="Message">
                    <div className="space-y-2">
                        <Textarea
                            id="message"
                            rows={5}
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                            placeholder="Décrivez votre demande, quantités, délais souhaités…"
                        />
                        {errors.message && <p className="text-sm text-accent">{errors.message}</p>}
                    </div>
                </ContactFormSection>

                <Button type="submit" size="lg" disabled={processing} className="contact-form-card__submit">
                    <Send className="h-4 w-4" />
                    {processing ? 'Envoi en cours…' : 'Envoyer le message'}
                </Button>
            </form>
        </div>
    );
}

export default function ContactIndex({ quoteProducts = [], prefilledSubject }) {
    const { siteSettings, whatsappNumber, company } = usePage().props;
    const mapsUrl = siteSettings?.google_maps_url || company?.maps_url;
    const whatsappUrl = formatWhatsAppUrl(whatsappNumber, 'Bonjour CEMAPROF, j\'aimerais des informations.');

    return (
        <MainLayout>
            <Head title="Contact — Demandez un Devis">
                <meta head-key="description" name="description" content="Contactez CEMAPROF pour un devis personnalisé, des informations produits ou notre service après-vente." />
            </Head>

            <PageHero
                title="Contactez-nous"
                subtitle="Réponse rapide par formulaire ou WhatsApp"
                eyebrow="Nous sommes à votre écoute"
                breadcrumb={[{ label: 'Contact' }]}
            />

            <section className="contact-quick-strip">
                <div className="container-wide">
                    <div className="contact-quick-strip__grid">
                        {siteSettings?.phone && (
                            <a href={`tel:${siteSettings.phone.replace(/\s/g, '')}`} className="contact-quick-card">
                                <span className="contact-quick-card__icon contact-quick-card__icon--primary">
                                    <Phone className="h-5 w-5" />
                                </span>
                                <span className="contact-quick-card__label">Téléphone</span>
                                <span className="contact-quick-card__value">{siteSettings.phone}</span>
                            </a>
                        )}
                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="contact-quick-card">
                            <span className="contact-quick-card__icon contact-quick-card__icon--whatsapp">
                                <MessageCircle className="h-5 w-5" />
                            </span>
                            <span className="contact-quick-card__label">WhatsApp</span>
                            <span className="contact-quick-card__value">Réponse rapide</span>
                        </a>
                        {siteSettings?.email && (
                            <a href={`mailto:${siteSettings.email}`} className="contact-quick-card">
                                <span className="contact-quick-card__icon contact-quick-card__icon--primary">
                                    <Mail className="h-5 w-5" />
                                </span>
                                <span className="contact-quick-card__label">Email</span>
                                <span className="contact-quick-card__value">{siteSettings.email}</span>
                            </a>
                        )}
                    </div>
                </div>
            </section>

            <div className="container-wide section-py">
                <div className="contact-page-layout">
                    <aside className="contact-sidebar">
                        <div className="contact-sidebar__card">
                            <h2 className="contact-sidebar__title">Nos coordonnées</h2>
                            <div className="contact-sidebar__list">
                                {siteSettings?.address && (
                                    <div className="contact-sidebar__item">
                                        <MapPin className="h-4 w-4 shrink-0 text-primary" />
                                        <div>
                                            <p className="contact-sidebar__item-label">Adresse</p>
                                            <p className="contact-sidebar__item-value">{siteSettings.address}</p>
                                            {mapsUrl && (
                                                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="contact-sidebar__link">
                                                    Google Maps →
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {siteSettings?.opening_hours && (
                                    <div className="contact-sidebar__item">
                                        <Clock className="h-4 w-4 shrink-0 text-primary" />
                                        <div>
                                            <p className="contact-sidebar__item-label">Horaires</p>
                                            <p className="contact-sidebar__item-value">{siteSettings.opening_hours}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="contact-sidebar__social">
                                {siteSettings?.facebook && (
                                    <a href={siteSettings.facebook} target="_blank" rel="noopener noreferrer" className="contact-sidebar__social-link" aria-label="Facebook">
                                        <FacebookIcon className="h-4 w-4" />
                                    </a>
                                )}
                                {siteSettings?.instagram && (
                                    <a href={siteSettings.instagram} target="_blank" rel="noopener noreferrer" className="contact-sidebar__social-link" aria-label="Instagram">
                                        <InstagramIcon className="h-4 w-4" />
                                    </a>
                                )}
                                {siteSettings?.linkedin && (
                                    <a href={siteSettings.linkedin} target="_blank" rel="noopener noreferrer" className="contact-sidebar__social-link" aria-label="LinkedIn">
                                        <LinkedInIcon className="h-4 w-4" />
                                    </a>
                                )}
                            </div>
                        </div>

                        {siteSettings?.google_maps_embed && (
                            <div className="contact-sidebar__map">
                                <iframe
                                    src={siteSettings.google_maps_embed}
                                    width="100%"
                                    height="220"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    title="Localisation CEMAPROF"
                                />
                            </div>
                        )}
                    </aside>

                    <div className="contact-main">
                        <ContactForm quoteProducts={quoteProducts} prefilledSubject={prefilledSubject} />
                    </div>
                </div>
            </div>

            <PageCta
                eyebrow="Besoin d'aide ?"
                title="Une question avant d'envoyer votre message ?"
                description="Appelez-nous ou écrivez-nous sur WhatsApp — nous vous guidons dans votre choix de matériel."
            />
        </MainLayout>
    );
}
