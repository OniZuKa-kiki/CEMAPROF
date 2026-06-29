import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, Copy, MessageCircle, Plus, Share2 } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import ImageZoomInspect from '@/Components/ImageZoomInspect';
import ProductCard from '@/Components/ProductCard';
import PageCta from '@/Components/PageCta';
import QuantityStepper from '@/Components/QuantityStepper';
import { PageHero, SectionTitle } from '@/Components/PageHero';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { useToast } from '@/Components/ui/use-toast';
import { useQuoteCart, buildQuoteContactUrl, buildWhatsAppProductMessage } from '@/hooks/useQuoteCart';
import { badgeLabels, formatPrice, formatWhatsAppUrl } from '@/lib/utils';
import JsonLd from '@/Components/JsonLd';
import { buildProductSchema } from '@/lib/structuredData';

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

export default function ProductShow({ product, relatedProducts = [], canonicalUrl = '' }) {
    const { whatsappNumber } = usePage().props;
    const { toast } = useToast();
    const { addItem, items } = useQuoteCart();
    const cartItem = items.find((item) => item.slug === product?.slug);
    const inCart = Boolean(cartItem);
    const images = getProductImages(product);
    const [selectedImage, setSelectedImage] = useState(images[0] || fallbackImage);
    const [copied, setCopied] = useState(false);
    const [quantity, setQuantity] = useState(cartItem?.quantity || 1);

    useEffect(() => {
        const nextImages = getProductImages(product);
        setSelectedImage(nextImages[0] || fallbackImage);
    }, [product?.slug]);

    useEffect(() => {
        setQuantity(cartItem?.quantity || 1);
    }, [product?.slug, cartItem?.quantity]);

    const quoteItem = useMemo(() => ({
        slug: product?.slug,
        name: product?.name,
        quantity,
        price: product?.price ?? null,
    }), [product?.slug, product?.name, product?.price, quantity]);

    const formattedPrice = product?.price != null ? formatPrice(product.price) : null;
    const lineTotal = product?.price != null ? formatPrice(Number(product.price) * quantity) : null;

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
        if (!product?.slug) {
            return;
        }

        const added = addItem(quoteItem);
        if (added) {
            toast({
                title: inCart ? 'Devis mis à jour' : 'Ajouté au devis',
                description: `${product.name} × ${quantity} ${inCart ? 'a été mis à jour.' : 'a été ajouté à votre demande.'}`,
                variant: 'success',
            });
        }
    };

    const contactUrl = buildQuoteContactUrl([quoteItem]);
    const whatsappMessage = buildWhatsAppProductMessage(product, quantity);
    const productSchema = buildProductSchema(product, canonicalUrl);

    return (
        <MainLayout>
            <Head title={`${product.name} — CEMAPROF`}>
                {metaDescription ? <meta head-key="description" name="description" content={metaDescription} /> : null}
                {canonicalUrl ? <link head-key="canonical" rel="canonical" href={canonicalUrl} /> : null}
                <meta head-key="og:title" property="og:title" content={product.name} />
                {product.short_description ? <meta head-key="og:description" property="og:description" content={product.short_description} /> : null}
                {product.image_url ? <meta head-key="og:image" property="og:image" content={product.image_url} /> : null}
                {canonicalUrl ? <meta head-key="og:url" property="og:url" content={canonicalUrl} /> : null}
                <JsonLd data={productSchema} id="product" />
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
                        <div className="product-detail-image overflow-hidden rounded-2xl shadow-card transition-shadow hover:shadow-card-hover">
                            <ImageZoomInspect
                                src={selectedImage || fallbackImage}
                                alt={product.name}
                                className="aspect-square w-full"
                                imgClassName="aspect-square w-full object-cover"
                                zoom={2.5}
                            />
                        </div>

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

                        <div className="product-purchase-box mt-8">
                            <div className="product-purchase-box__price">
                                {formattedPrice ? (
                                    <>
                                        <span className="product-purchase-box__price-value">{formattedPrice}</span>
                                        <span className="product-purchase-box__price-note">Prix indicatif HT — devis personnalisé sur demande</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="product-purchase-box__price-value product-purchase-box__price-value--quote">Prix sur devis</span>
                                        <span className="product-purchase-box__price-note">Contactez-nous pour un tarif adapté à votre quantité.</span>
                                    </>
                                )}
                            </div>

                            <QuantityStepper
                                value={quantity}
                                onChange={setQuantity}
                                className="product-purchase-box__quantity"
                            />

                            {lineTotal && quantity > 1 && (
                                <p className="product-purchase-box__subtotal">
                                    Sous-total indicatif : <strong>{lineTotal}</strong>
                                </p>
                            )}

                            <p className="product-purchase-box__variants-note">
                                Couleur, taille ou autres options : précisez-les dans votre message. Les variantes seront bientôt sélectionnables directement ici.
                            </p>

                            <div className="product-purchase-box__actions">
                                <Button className="product-action-btn" asChild>
                                    <Link href={contactUrl}>
                                        Demander un devis
                                    </Link>
                                </Button>

                                <Button
                                    variant="outline"
                                    className="product-action-btn"
                                    onClick={handleAddToQuote}
                                >
                                    {inCart ? (
                                        <>
                                            <Check className="h-5 w-5" />
                                            Mettre à jour ma sélection
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="h-5 w-5" />
                                            Ajouter à ma sélection
                                        </>
                                    )}
                                </Button>

                                <Button variant="outline" className="product-action-btn product-action-btn--whatsapp" asChild>
                                    <a
                                        href={formatWhatsAppUrl(whatsappNumber || '212600000000', whatsappMessage)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <MessageCircle className="h-5 w-5" />
                                        WhatsApp
                                    </a>
                                </Button>
                            </div>
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
                description="Indiquez vos quantités et besoins — nous vous répondons rapidement."
            />
        </MainLayout>
    );
}
