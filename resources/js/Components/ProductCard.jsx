import { Link } from '@inertiajs/react';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { useQuoteCart, buildQuoteContactUrl } from '@/hooks/useQuoteCart';
import { badgeLabels } from '@/lib/utils';
import { cn } from '@/lib/utils';

const badgeVariantMap = {
    nouveau: 'default',
    populaire: 'accent',
    promo: 'promo',
};

export default function ProductCard({ product, className }) {
    const { items } = useQuoteCart();
    const inCart = items.some((item) => item.slug === product.slug);
    const quoteUrl = buildQuoteContactUrl([{ slug: product.slug, name: product.name }]);

    return (
        <article className={cn('product-card product-card--v2 group reveal-on-scroll', className)}>
            <Link href={`/produits/${product.slug}`} className="product-image-wrap relative block">
                <img
                    src={product.image_url || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80'}
                    alt={product.name}
                    loading="lazy"
                    className="h-48 w-full object-cover sm:h-52"
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
                <div className="mt-4 pt-1">
                    <Button className="w-full" size="sm" asChild>
                        <Link href={inCart ? '/contact?subject=devis' : quoteUrl}>
                            {inCart ? 'Finaliser le devis' : 'Demander un devis'}
                        </Link>
                    </Button>
                </div>
            </div>
        </article>
    );
}
