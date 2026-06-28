import { useState } from 'react';
import { Package, X } from 'lucide-react';
import { Label } from '@/Components/ui/label';
import { cn } from '@/lib/utils';

export default function QuoteProductsField({ items, onRemove, onClearAll }) {
    const [expanded, setExpanded] = useState(false);
    const previewLimit = 8;
    const hasMore = items.length > previewLimit;
    const visibleItems = expanded || !hasMore ? items : items.slice(0, previewLimit);

    return (
        <div className="quote-products-field">
            <div className="quote-products-field__header">
                <Label className="text-sm font-semibold">
                    Produits concernés
                    <span className="ml-2 inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-white">
                        {items.length}
                    </span>
                </Label>
                {items.length > 1 && (
                    <button
                        type="button"
                        onClick={onClearAll}
                        className="text-xs font-medium text-accent transition-colors hover:text-accent/80"
                    >
                        Tout retirer
                    </button>
                )}
            </div>

            <div className={cn('quote-products-field__chips custom-scrollbar', hasMore && !expanded && 'quote-products-field__chips--fade')}>
                {visibleItems.map((item, index) => (
                    <span key={item.slug} className="quote-products-chip">
                        <span className="quote-products-chip__index" aria-hidden="true">
                            {index + 1}
                        </span>
                        <Package className="h-3 w-3 shrink-0 opacity-60" aria-hidden="true" />
                        <span className="quote-products-chip__name" title={item.name}>
                            {item.name}
                        </span>
                        <button
                            type="button"
                            onClick={() => onRemove(item.slug)}
                            className="quote-products-chip__remove"
                            aria-label={`Retirer ${item.name}`}
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </span>
                ))}
            </div>

            {hasMore && (
                <button
                    type="button"
                    onClick={() => setExpanded((value) => !value)}
                    className="quote-products-field__toggle"
                >
                    {expanded
                        ? 'Afficher moins'
                        : `+ ${items.length - previewLimit} autre${items.length - previewLimit > 1 ? 's' : ''} produit${items.length - previewLimit > 1 ? 's' : ''}`}
                </button>
            )}
        </div>
    );
}
