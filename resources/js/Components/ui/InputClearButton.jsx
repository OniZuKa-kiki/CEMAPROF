import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function InputClearButton({ onClear, className, label = 'Effacer' }) {
    return (
        <button
            type="button"
            className={cn('input-clear-btn', className)}
            onClick={onClear}
            aria-label={label}
            tabIndex={-1}
        >
            <X className="input-clear-btn__icon" aria-hidden="true" />
        </button>
    );
}
