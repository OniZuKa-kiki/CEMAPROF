import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronDown, FileText, X } from 'lucide-react';
import { useQuoteCart, buildQuoteContactUrl } from '@/hooks/useQuoteCart';
import { useAboveFooterOffset } from '@/hooks/useAboveFooterOffset';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';

export default function QuoteCartBar() {
    const { items, removeItem, count } = useQuoteCart();
    const [expanded, setExpanded] = useState(true);
    const bottomOffset = useAboveFooterOffset([count, expanded]);

    if (count === 0) {
        return null;
    }

    const positionStyle = { bottom: `${bottomOffset}px` };

    if (!expanded) {
        return (
            <button
                type="button"
                onClick={() => setExpanded(true)}
                className="quote-cart-pill animate-fade-up"
                style={positionStyle}
                aria-label={`Ouvrir le devis — ${count} produit${count > 1 ? 's' : ''}`}
            >
                <span className="quote-cart-pill__icon">
                    <FileText className="h-4 w-4" />
                </span>
                <span className="quote-cart-pill__label">Devis</span>
                <span className="quote-cart-pill__count">{count}</span>
            </button>
        );
    }

    return (
        <div className="quote-cart-panel animate-fade-up" style={positionStyle}>
            <div className="quote-cart-panel__header">
                <div className="flex items-center gap-2.5">
                    <span className="quote-cart-pill__icon">
                        <FileText className="h-4 w-4" />
                    </span>
                    <div>
                        <p className="text-sm font-semibold text-foreground leading-tight">
                            Votre devis
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {count} produit{count > 1 ? 's' : ''} sélectionné{count > 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setExpanded(false)}
                    className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                    aria-label="Réduire le panier devis"
                >
                    <ChevronDown className="h-4 w-4" />
                </button>
            </div>

            <ul className={cn('quote-cart-panel__list custom-scrollbar', count > 4 && 'quote-cart-panel__list--compact')}>
                {items.map((item, index) => (
                    <li key={item.slug} className="quote-cart-panel__item">
                        <span className="quote-cart-panel__item-index" aria-hidden="true">
                            {index + 1}
                        </span>
                        <span className="truncate">{item.name}</span>
                        <button
                            type="button"
                            onClick={() => removeItem(item.slug)}
                            className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-white hover:text-accent"
                            aria-label={`Retirer ${item.name}`}
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </li>
                ))}
            </ul>

            <Button className="w-full" size="sm" asChild>
                <Link href={buildQuoteContactUrl(items)}>Demander un devis</Link>
            </Button>
        </div>
    );
}
