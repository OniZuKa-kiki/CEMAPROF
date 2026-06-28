import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function QuantityStepper({
    value,
    onChange,
    min = 1,
    max = 999,
    className,
    label = 'Quantité',
    compact = false,
}) {
    const clamp = (next) => Math.min(max, Math.max(min, next));

    return (
        <div className={cn('quantity-stepper', compact && 'quantity-stepper--compact', className)}>
            {!compact && <span className="quantity-stepper__label">{label}</span>}
            <div className="quantity-stepper__control">
                <button
                    type="button"
                    className="quantity-stepper__btn"
                    onClick={() => onChange(clamp(value - 1))}
                    disabled={value <= min}
                    aria-label="Diminuer la quantité"
                >
                    <Minus className="h-4 w-4" />
                </button>
                <input
                    type="number"
                    className="quantity-stepper__input"
                    value={value}
                    min={min}
                    max={max}
                    onChange={(e) => onChange(clamp(parseInt(e.target.value, 10) || min))}
                    aria-label={label || 'Quantité'}
                />
                <button
                    type="button"
                    className="quantity-stepper__btn"
                    onClick={() => onChange(clamp(value + 1))}
                    disabled={value >= max}
                    aria-label="Augmenter la quantité"
                >
                    <Plus className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
