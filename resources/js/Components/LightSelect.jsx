import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Accessible dropdown without Radix — avoids react-remove-scroll (white bar on open).
 */
export default function LightSelect({
    value,
    onValueChange,
    options = [],
    placeholder = 'Choisir…',
    ariaLabel,
    id,
    triggerClassName,
    contentClassName,
    itemClassName,
    renderTrigger,
    renderItem,
    align = 'start',
}) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef(null);
    const listId = useId();
    const selected = options.find((option) => option.value === value);

    useEffect(() => {
        if (!open) {
            return undefined;
        }

        const closeOnOutside = (event) => {
            if (!rootRef.current?.contains(event.target)) {
                setOpen(false);
            }
        };

        const closeOnEscape = (event) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', closeOnOutside);
        document.addEventListener('keydown', closeOnEscape);

        return () => {
            document.removeEventListener('mousedown', closeOnOutside);
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [open]);

    const handleSelect = (nextValue) => {
        onValueChange?.(nextValue);
        setOpen(false);
    };

    return (
        <div ref={rootRef} className="light-select relative w-full">
            <button
                type="button"
                id={id}
                className={cn('light-select__trigger flex w-full items-center justify-between gap-2', triggerClassName)}
                aria-label={ariaLabel}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={listId}
                onClick={() => setOpen((current) => !current)}
            >
                <span className="light-select__value flex min-w-0 flex-1 items-center gap-2 text-left">
                    {renderTrigger ? renderTrigger(selected) : (selected?.label ?? placeholder)}
                </span>
                <ChevronDown
                    className={cn('h-4 w-4 shrink-0 opacity-50 transition-transform duration-200', open && 'rotate-180')}
                    aria-hidden="true"
                />
            </button>

            {open && (
                <ul
                    id={listId}
                    role="listbox"
                    aria-label={ariaLabel}
                    className={cn(
                        'light-select__content absolute left-0 right-0 z-[80] mt-1 max-h-96 w-full overflow-auto rounded-xl border border-gray-200 bg-white p-1 shadow-md',
                        align === 'end' && 'left-auto',
                        contentClassName,
                    )}
                >
                    {options.map((option) => {
                        const isSelected = option.value === value;

                        return (
                            <li key={option.value} role="presentation">
                                <button
                                    type="button"
                                    role="option"
                                    aria-selected={isSelected}
                                    className={cn(
                                        'ui-select-item light-select__item relative flex w-full cursor-default select-none items-center rounded-lg py-2 pl-8 pr-2 text-sm outline-none hover:bg-surface hover:text-primary focus:bg-surface focus:text-primary',
                                        isSelected && 'bg-surface/60 text-primary',
                                        itemClassName,
                                    )}
                                    onClick={() => handleSelect(option.value)}
                                >
                                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                        {isSelected && <Check className="h-4 w-4" aria-hidden="true" />}
                                    </span>
                                    {renderItem ? renderItem(option, isSelected) : option.label}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
