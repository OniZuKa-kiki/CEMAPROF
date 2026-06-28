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

export default function ProductCard({ product, className }) {
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
        <article className={cn('product-card product-card--v2 group reveal-on-scroll', className)}>
            <Link href={`/produits/${product.slug}`} className="product-image-wrap relative block">
                <img
                    src={product.image_url || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80'}
                    alt={product.name}
                    loading="lazy"
                    className="product-card__img h-48 w-full object-cover sm:h-52"
                />
                {product.badge && (
                    <Badge variant={badgeVariantMap[product.badge]} className="absolute left-3 top-3 z-10">
                        {badgeLabels[product.badge]}
                    </Badge>
                )}
            </Link>
            <div className="flex flex-1 flex-col p-4 sm:p-5">
                {product.category && (
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                        {product.category.name}
                    </p>
                )}
                <Link href={`/produits/${product.slug}`} className="block">
                    <h3 className="line-clamp-2 font-semibold text-foreground transition-colors group-hover:text-primary">
                        {product.name}
                    </h3>
                </Link>
                <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">
                    {product.short_description}
                </p>
                {displayPrice ? (
                    <p className="mt-3 text-lg font-bold text-primary">{displayPrice}</p>
                ) : (
                    <p className="mt-3 text-sm font-medium text-muted-foreground">Prix sur devis</p>
                )}
                <QuantityStepper
                    compact
                    value={quantity}
                    onChange={setQuantity}
                    className="product-card__qty mt-3"
                    max={999}
                />
                <div className="product-card__actions">
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
            </div>
        </article>
    );
}
