import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Check, FileText, Plus } from 'lucide-react';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import QuantityStepper from '@/Components/QuantityStepper';
import { useToast } from '@/Components/ui/use-toast';
import { useQuoteCart, buildQuoteContactUrl } from '@/hooks/useQuoteCart';
import { badgeLabels, formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

const badgeVariantMap = {
    nouveau: 'default',
    populaire: 'accent',
    promo: 'promo',
};

const fallbackImage = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80';

export default function ProductListRow({ product, className }) {
    const { toast } = useToast();
    const { items, addItem } = useQuoteCart();
    const cartItem = items.find((item) => item.slug === product.slug);
    const inCart = Boolean(cartItem);
    const [quantity, setQuantity] = useState(cartItem?.quantity || 1);

    useEffect(() => {
        setQuantity(cartItem?.quantity || 1);
    }, [product.slug, cartItem?.quantity]);

    const quoteItem = {
        slug: product.slug,
        name: product.name,
        quantity,
        price: product.price ?? null,
    };
    const quoteUrl = buildQuoteContactUrl([quoteItem]);
    const displayPrice = product.price != null ? formatPrice(product.price) : null;

    const handleAddToQuote = () => {
        const added = addItem(quoteItem);
        if (added) {
            toast({
                title: inCart ? 'Sélection mise à jour' : 'Ajouté à votre devis',
                description: `${product.name} × ${quantity}`,
                variant: 'success',
            });
        }
    };

    return (
        <article className={cn('product-list-row group reveal-on-scroll', className)}>
            <Link href={`/produits/${product.slug}`} className="product-list-row__image product-card__media">
                <img
                    src={product.image_url || fallbackImage}
                    alt={product.name}
                    loading="lazy"
                    className="product-card__img"
                />
                {product.badge && (
                    <Badge variant={badgeVariantMap[product.badge]} className="product-list-row__badge">
                        {badgeLabels[product.badge]}
                    </Badge>
                )}
            </Link>

            <div className="product-list-row__body product-card__body">
                {product.category && (
                    <p className="product-list-row__category">{product.category.name}</p>
                )}
                <Link href={`/produits/${product.slug}`}>
                    <h3 className="product-list-row__title">{product.name}</h3>
                </Link>
                {product.short_description && (
                    <p className="product-list-row__desc product-card__desc">{product.short_description}</p>
                )}
                {displayPrice ? (
                    <p className="product-list-row__price">{displayPrice}</p>
                ) : (
                    <p className="product-list-row__price product-list-row__price--muted">Prix sur devis</p>
                )}
                <QuantityStepper
                    compact
                    value={quantity}
                    onChange={setQuantity}
                    className="product-list-row__qty product-card__qty"
                    max={999}
                />
            </div>

            <div className="product-list-row__actions product-card__actions">
                <button
                    type="button"
                    onClick={handleAddToQuote}
                    className={cn(
                        'product-card__btn-select inline-flex items-center justify-center gap-2',
                        inCart && 'product-card__btn-select--active',
                    )}
                >
                    {inCart ? (
                        <>
                            <Check className="h-4 w-4" />
                            Mettre à jour ({quantity})
                        </>
                    ) : (
                        <>
                            <Plus className="h-4 w-4" />
                            Ajouter à ma sélection
                        </>
                    )}
                </button>
                <Button variant="accent" size="sm" className="product-card__btn-quote" asChild>
                    <Link href={quoteUrl}>
                        <FileText className="h-4 w-4" />
                        Demander un devis
                    </Link>
                </Button>
            </div>
        </article>
    );
}
