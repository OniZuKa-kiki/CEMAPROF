import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { FacebookIcon, InstagramIcon, LinkedInIcon } from '@/Components/SocialIcons';
import MainLayout from '@/Layouts/MainLayout';
import QuoteProductsField from '@/Components/QuoteProductsField';
import PageCta from '@/Components/PageCta';
import { PageHero } from '@/Components/PageHero';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Label } from '@/Components/ui/label';
import { NativeSelect } from '@/Components/ui/native-select';
import { Card, CardContent } from '@/Components/ui/card';
import { useToast } from '@/Components/ui/use-toast';
import { subjectOptions, formatWhatsAppUrl } from '@/lib/utils';
import { useQuoteCart } from '@/hooks/useQuoteCart';

function buildDefaultMessage(products) {
    if (!products?.length) {
        return '';
    }

    if (products.length === 1) {
        return `Bonjour, je souhaite obtenir des informations concernant le produit : ${products[0].name}.`;
    }

    return `Bonjour, je souhaite obtenir un devis pour les produits suivants :\n${products.map((product) => `- ${product.name}`).join('\n')}`;
}

function ContactForm({ quoteProducts = [], prefilledSubject }) {
    const { flash } = usePage().props;
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

    useEffect(() => {
        if (flash?.success) {
            toast({ title: 'Message envoyé !', description: flash.success, variant: 'success' });
            clearCart();
            messageInitialized.current = false;
            reset();
        }
    }, [flash?.success, toast, reset, clearCart]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/contact', {
            preserveScroll: true,
            onSuccess: () => {
                clearCart();
                messageInitialized.current = false;
                toast({
                    title: 'Message envoyé !',
                    description: 'Nous vous répondrons sous 24h.',
                    variant: 'success',
                });
            },
        });
    };

    return (
        <Card className="border-0 shadow-card">
            <CardContent className="p-6 sm:p-8">
                <h2 className="mb-6 text-2xl font-bold">Envoyez-nous un message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Honeypot anti-spam — laisser vide */}
                    <input
                        type="text"
                        name="website"
                        value={data.website}
                        onChange={(e) => setData('website', e.target.value)}
                        className="hidden"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                    />

                    <div className="grid gap-5 sm:grid-cols-2">
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
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
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

                    <div className="space-y-2">
                        <Label htmlFor="subject">Sujet *</Label>
                        <NativeSelect
                            id="subject"
                            value={String(data.subject ?? 'devis')}
                            onChange={(e) => setData('subject', e.target.value)}
                        >
                            {subjectOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </NativeSelect>
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

                    <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                            id="message"
                            rows={5}
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                            placeholder="Décrivez votre demande..."
                        />
                        {errors.message && <p className="text-sm text-accent">{errors.message}</p>}
                    </div>

                    <Button type="submit" size="lg" disabled={processing} className="w-full sm:w-auto">
                        {processing ? 'Envoi en cours...' : 'Envoyer le message'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

export default function ContactIndex({ quoteProducts = [], prefilledSubject }) {
    const { siteSettings, whatsappNumber } = usePage().props;

    return (
        <MainLayout>
            <Head title="Contact — Demandez un Devis">
                <meta head-key="description" name="description" content="Contactez CEMAPROF pour un devis personnalisé, des informations produits ou notre service après-vente." />
            </Head>

            <PageHero
                title="Contactez-nous"
                subtitle="Notre équipe vous répond sous 24 heures"
                eyebrow="Nous sommes à votre écoute"
                breadcrumb={[{ label: 'Contact' }]}
            />

            <div className="container-wide section-py">
                <div className="grid gap-12 lg:grid-cols-5">
                    <div className="space-y-6 lg:col-span-2">
                        <Card className="border-0 shadow-card">
                            <CardContent className="space-y-6 p-6">
                                {siteSettings?.address && (
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">Adresse</p>
                                            <p className="text-sm text-muted-foreground">{siteSettings.address}</p>
                                        </div>
                                    </div>
                                )}
                                {siteSettings?.phone && (
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <Phone className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">Téléphone</p>
                                            <a href={`tel:${siteSettings.phone.replace(/\s/g, '')}`} className="text-sm text-primary hover:underline">
                                                {siteSettings.phone}
                                            </a>
                                        </div>
                                    </div>
                                )}
                                {siteSettings?.email && (
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">Email</p>
                                            <a href={`mailto:${siteSettings.email}`} className="text-sm text-primary hover:underline">
                                                {siteSettings.email}
                                            </a>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#25D366]/10 text-[#25D366]">
                                        <MessageCircle className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">WhatsApp</p>
                                        <a
                                            href={formatWhatsAppUrl(whatsappNumber, 'Bonjour CEMAPROF')}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-[#25D366] hover:underline"
                                        >
                                            Discuter sur WhatsApp
                                        </a>
                                    </div>
                                </div>
                                {siteSettings?.opening_hours && (
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <Clock className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">Horaires</p>
                                            <p className="text-sm text-muted-foreground">{siteSettings.opening_hours}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="flex gap-3">
                            {siteSettings?.facebook && (
                                <a href={siteSettings.facebook} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-primary transition-colors hover:bg-primary hover:text-white">
                                    <FacebookIcon className="h-5 w-5" />
                                </a>
                            )}
                            {siteSettings?.instagram && (
                                <a href={siteSettings.instagram} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-primary transition-colors hover:bg-primary hover:text-white">
                                    <InstagramIcon className="h-5 w-5" />
                                </a>
                            )}
                            {siteSettings?.linkedin && (
                                <a href={siteSettings.linkedin} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-primary transition-colors hover:bg-primary hover:text-white">
                                    <LinkedInIcon className="h-5 w-5" />
                                </a>
                            )}
                        </div>

                        {siteSettings?.google_maps_embed && (
                            <div className="overflow-hidden rounded-2xl shadow-card">
                                <iframe
                                    src={siteSettings.google_maps_embed}
                                    width="100%"
                                    height="250"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Localisation CEMAPROF"
                                />
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-3">
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
