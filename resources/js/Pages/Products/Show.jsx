import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { ArrowLeft, Check, Copy, MessageCircle, Plus, Share2, X, ZoomIn } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/ProductCard';
import PageCta from '@/Components/PageCta';
import { PageHero, SectionTitle } from '@/Components/PageHero';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { useToast } from '@/Components/ui/use-toast';
import { useQuoteCart, buildQuoteContactUrl } from '@/hooks/useQuoteCart';
import { badgeLabels, formatWhatsAppUrl } from '@/lib/utils';

const badgeVariantMap = {
    nouveau: 'default',
    populaire: 'accent',
    promo: 'promo',
};

const fallbackImage = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80';

function getProductImages(product) {
    if (product?.all_images?.length) {
        return product.all_images;
    }

    return product?.image_url ? [product.image_url] : [];
}

export default function ProductShow({ product, relatedProducts = [] }) {
    const { whatsappNumber } = usePage().props;
    const { toast } = useToast();
    const { addItem, items } = useQuoteCart();
    const inCart = items.some((item) => item.slug === product?.slug);
    const images = getProductImages(product);
    const [selectedImage, setSelectedImage] = useState(images[0] || fallbackImage);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const nextImages = getProductImages(product);
        setSelectedImage(nextImages[0] || fallbackImage);
        setLightboxOpen(false);
    }, [product?.slug]);

    if (!product?.slug) {
        return (
            <MainLayout>
                <div className="container-wide py-24 text-center">
                    <p className="text-muted-foreground">Produit introuvable.</p>
                    <Button className="mt-4" asChild>
                        <Link href="/produits">Retour au catalogue</Link>
                    </Button>
                </div>
            </MainLayout>
        );
    }

    const whatsappMessage = `Bonjour CEMAPROF, je souhaite obtenir un devis pour le produit : ${product.name}`;
    const metaDescription = product.short_description
        || (typeof product.description === 'string' ? product.description.substring(0, 160) : '');
    const badgeVariant = badgeVariantMap[product.badge] || 'default';

    const copyLink = () => {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleAddToQuote = () => {
        if (inCart || !product?.slug) {
            return;
        }

        const added = addItem({ slug: product.slug, name: product.name });
        if (added) {
            toast({
                title: 'Ajouté au devis',
                description: `${product.name} a été ajouté à votre demande de devis.`,
                variant: 'success',
            });
        }
    };

    return (
        <MainLayout>
            <Head title={`${product.name} — CEMAPROF`}>
                {metaDescription ? <meta head-key="description" name="description" content={metaDescription} /> : null}
                <meta head-key="og:title" property="og:title" content={product.name} />
                {product.short_description ? <meta head-key="og:description" property="og:description" content={product.short_description} /> : null}
                {product.image_url ? <meta head-key="og:image" property="og:image" content={product.image_url} /> : null}
            </Head>

            <PageHero
                title={product.name}
                eyebrow={product.category?.name || 'Produit'}
                breadcrumb={[
                    { label: 'Produits', href: '/produits' },
                    ...(product.category ? [{ label: product.category.name, href: `/categories/${product.category.slug}` }] : []),
                    { label: product.name },
                ]}
            />

            <div className="container-wide section-py">
                <Button variant="ghost" size="sm" className="mb-6" asChild>
                    <Link href="/produits"><ArrowLeft className="mr-2 h-4 w-4" />Retour aux produits</Link>
                </Button>

                <div className="grid gap-12 lg:grid-cols-2">
                    <div>
                        <button
                            type="button"
                            onClick={() => setLightboxOpen(true)}
                            className="group relative block w-full overflow-hidden rounded-2xl shadow-card transition-shadow hover:shadow-card-hover"
                        >
                            <img
                                src={selectedImage || fallbackImage}
                                alt={product.name}
                                className="aspect-square w-full object-cover"
                            />
                            <span className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-black/50 px-3 py-1.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                                <ZoomIn className="h-4 w-4" />
                                Agrandir
                            </span>
                        </button>

                        {images.length > 1 && (
                            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                                {images.map((img, i) => (
                                    <button
                                        key={`${img}-${i}`}
                                        type="button"
                                        onClick={() => setSelectedImage(img)}
                                        className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                                            selectedImage === img ? 'border-primary shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            {product.badge && badgeLabels[product.badge] && (
                                <Badge variant={badgeVariant}>
                                    {badgeLabels[product.badge]}
                                </Badge>
                            )}
                            {product.category && (
                                <Link href={`/categories/${product.category.slug}`} className="text-sm font-medium text-primary hover:underline">
                                    {product.category.name}
                                </Link>
                            )}
                        </div>

                        <h1 className="mt-4 text-3xl font-bold text-foreground">{product.name}</h1>

                        {product.short_description && (
                            <p className="mt-4 text-lg text-muted-foreground">{product.short_description}</p>
                        )}

                        {product.description && (
                            <div className="mt-6 max-w-none text-muted-foreground">
                                <p className="leading-relaxed whitespace-pre-line">{product.description}</p>
                            </div>
                        )}

                        <div className="mt-8 rounded-2xl border-2 border-primary/20 bg-primary/5 p-6">
                            <p className="text-lg font-semibold text-primary">Prix sur devis — Contactez-nous</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Obtenez un devis personnalisé adapté à vos besoins et quantités.
                            </p>
                        </div>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Button size="lg" className="flex-1" onClick={handleAddToQuote} disabled={inCart}>
                                {inCart ? (
                                    <>
                                        <Check className="mr-2 h-5 w-5" />
                                        Dans le devis
                                    </>
                                ) : (
                                    <>
                                        <Plus className="mr-2 h-5 w-5" />
                                        Ajouter au devis
                                    </>
                                )}
                            </Button>
                            <Button size="lg" variant="outline" className="flex-1" asChild>
                                <Link href={buildQuoteContactUrl([{ slug: product.slug, name: product.name }])}>
                                    Devis immédiat
                                </Link>
                            </Button>
                        </div>
                        <div className="mt-3">
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white sm:w-auto"
                                asChild
                            >
                                <a
                                    href={formatWhatsAppUrl(whatsappNumber || '212600000000', whatsappMessage)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <MessageCircle className="mr-2 h-5 w-5" />
                                    WhatsApp
                                </a>
                            </Button>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-3 border-t pt-6">
                            <Share2 className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Partager :</span>
                            <Button variant="ghost" size="sm" type="button" onClick={copyLink}>
                                {copied ? <Check className="mr-1 h-4 w-4 text-emerald-500" /> : <Copy className="mr-1 h-4 w-4" />}
                                {copied ? 'Copié !' : 'Copier le lien'}
                            </Button>
                        </div>
                    </div>
                </div>

                {relatedProducts.length > 0 && (
                    <div className="mt-20">
                        <SectionTitle title="Produits similaires" centered={false} />
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <PageCta
                eyebrow="Intéressé par ce produit ?"
                title="Obtenez un devis sur mesure"
                description="Indiquez vos quantités et besoins — notre équipe vous répond sous 24h."
            />

            {lightboxOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Aperçu — ${product.name}`}
                    onClick={() => setLightboxOpen(false)}
                >
                    <button
                        type="button"
                        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                        onClick={() => setLightboxOpen(false)}
                        aria-label="Fermer"
                    >
                        <X className="h-6 w-6" />
                    </button>
                    <img
                        src={selectedImage || fallbackImage}
                        alt={product.name}
                        className="max-h-[90vh] max-w-full rounded-2xl object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </MainLayout>
    );
}
