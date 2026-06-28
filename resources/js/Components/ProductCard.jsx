import { Link } from '@inertiajs/react';
import { ArrowRight, Check, Plus } from 'lucide-react';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { useToast } from '@/Components/ui/use-toast';
import { useQuoteCart, buildQuoteContactUrl } from '@/hooks/useQuoteCart';
import { badgeLabels } from '@/lib/utils';
import { cn } from '@/lib/utils';

const badgeVariantMap = {
    nouveau: 'default',
    populaire: 'accent',
    promo: 'promo',
};

export default function ProductCard({ product, className }) {
    const { addItem, items } = useQuoteCart();
    const { toast } = useToast();
    const inCart = items.some((item) => item.slug === product.slug);

    const handleAddToQuote = () => {
        if (inCart) {
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
        <div className={cn('product-card group reveal-on-scroll', className)}>
            <Link href={`/produits/${product.slug}`} className="product-image-wrap relative block">
                <img
                    src={product.image_url || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80'}
                    alt={product.name}
                    loading="lazy"
                    className="h-52 w-full object-cover"
                />
                {product.badge && (
                    <Badge variant={badgeVariantMap[product.badge]} className="absolute left-3 top-3 z-10">
                        {badgeLabels[product.badge]}
                    </Badge>
                )}
            </Link>
            <div className="p-5">
                {product.category && (
                    <p className="mb-1 text-xs font-medium uppercase tracking-wider text-primary">
                        {product.category.name}
                    </p>
                )}
                <Link href={`/produits/${product.slug}`}>
                    <h3 className="font-semibold text-foreground transition-colors group-hover:text-primary line-clamp-2">
                        {product.name}
                    </h3>
                </Link>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {product.short_description}
                </p>
            </div>
            <div className="px-5 pb-5 flex flex-col gap-2">
                <Button variant="outline" className="w-full" onClick={handleAddToQuote} disabled={inCart}>
                    {inCart ? (
                        <>
                            <Check className="mr-1 h-4 w-4" />
                            Dans le devis
                        </>
                    ) : (
                        <>
                            <Plus className="mr-1 h-4 w-4" />
                            Ajouter au devis
                        </>
                    )}
                </Button>
                <Button variant="ghost" className="w-full text-primary" asChild>
                    <Link href={buildQuoteContactUrl([{ slug: product.slug, name: product.name }])}>
                        Devis immédiat
                        <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                </Button>
            </div>
        </div>
    );
}
