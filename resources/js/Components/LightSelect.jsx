import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { matchesSearch } from '@/lib/searchNormalize';
import { cn } from '@/lib/utils';

function orderOptions(options, pinnedValues = []) {
    if (!pinnedValues.length) {
        return options;
    }

    const pinned = pinnedValues
        .map((value) => options.find((option) => option.value === value))
        .filter(Boolean);
    const rest = options.filter((option) => !pinnedValues.includes(option.value));

    return [...pinned, ...rest];
}

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
    fitContent = false,
    searchable = false,
    pinnedValues = [],
    searchPlaceholder = 'Rechercher…',
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [fitWidth, setFitWidth] = useState(null);
    const rootRef = useRef(null);
    const sizerRef = useRef(null);
    const searchRef = useRef(null);
    const listId = useId();
    const selected = options.find((option) => option.value === value);
    const enableSearch = searchable === true;

    const orderedOptions = useMemo(
        () => orderOptions(options, pinnedValues),
        [options, pinnedValues],
    );

    const visibleOptions = useMemo(() => {
        const trimmed = query.trim().toLowerCase();

        if (!enableSearch || !trimmed) {
            return orderedOptions;
        }

        return orderedOptions.filter((option) => (
            pinnedValues.includes(option.value)
            || matchesSearch(option.label, trimmed)
        ));
    }, [orderedOptions, query, enableSearch, pinnedValues]);

    useLayoutEffect(() => {
        if (!fitContent || !sizerRef.current) {
            setFitWidth(null);
            return;
        }

        const measure = () => {
            const items = sizerRef.current?.querySelectorAll('[data-sizer-item]');
            if (!items?.length) {
                return;
            }

            let max = 0;
            items.forEach((item) => {
                max = Math.max(max, item.getBoundingClientRect().width);
            });

            setFitWidth(Math.ceil(max));
        };

        measure();
        window.addEventListener('resize', measure);

        return () => window.removeEventListener('resize', measure);
    }, [fitContent, options, renderItem]);

    useEffect(() => {
        if (!open) {
            setQuery('');
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

        if (enableSearch) {
            requestAnimationFrame(() => searchRef.current?.focus());
        }

        return () => {
            document.removeEventListener('mousedown', closeOnOutside);
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [open, enableSearch]);

    const handleSelect = (nextValue) => {
        onValueChange?.(nextValue);
        setOpen(false);
        setQuery('');
    };

    return (
        <div
            ref={rootRef}
            className={cn('light-select relative', fitContent ? 'light-select--fit w-auto' : 'w-full')}
            style={fitContent && fitWidth ? { width: fitWidth } : undefined}
        >
            {fitContent && (
                <div
                    ref={sizerRef}
                    className="pointer-events-none invisible absolute left-0 top-0 -z-10 h-0 overflow-hidden"
                    aria-hidden="true"
                >
                    {options.map((option) => (
                        <div
                            key={option.value}
                            data-sizer-item
                            className={cn(
                                'light-select__trigger inline-flex items-center gap-2 whitespace-nowrap',
                                triggerClassName,
                            )}
                        >
                            {renderItem ? renderItem(option, false) : option.label}
                            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
                        </div>
                    ))}
                </div>
            )}
            <button
                type="button"
                id={id}
                className={cn(
                    'light-select__trigger flex items-center justify-between gap-2',
                    fitContent ? 'w-full whitespace-nowrap' : 'w-full',
                    triggerClassName,
                )}
                aria-label={ariaLabel}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={listId}
                onClick={() => setOpen((current) => !current)}
            >
                <span className={cn(
                    'light-select__value flex items-center gap-2 text-left',
                    fitContent ? 'min-w-0 shrink-0' : 'min-w-0 flex-1',
                )}>
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
                        'light-select__content absolute z-[80] mt-1 max-h-96 overflow-auto rounded-xl border border-gray-200 bg-white p-1 shadow-md',
                        fitContent ? 'left-0 w-max min-w-full whitespace-nowrap' : 'left-0 right-0 w-full',
                        align === 'end' && 'left-auto right-0',
                        contentClassName,
                    )}
                    style={fitContent && fitWidth ? { minWidth: fitWidth } : undefined}
                >
                    {enableSearch && (
                        <li className="light-select__search" role="presentation">
                            <Search className="light-select__search-icon h-3.5 w-3.5" aria-hidden="true" />
                            <input
                                ref={searchRef}
                                type="search"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                onKeyDown={(event) => event.stopPropagation()}
                                placeholder={searchPlaceholder}
                                className="light-select__search-input"
                                aria-label={searchPlaceholder}
                            />
                        </li>
                    )}

                    {visibleOptions.length === 0 ? (
                        <li className="light-select__empty" role="presentation">
                            Aucun résultat
                        </li>
                    ) : visibleOptions.map((option) => {
                        const isSelected = option.value === value;
                        const isPinned = pinnedValues.includes(option.value);

                        return (
                            <li key={option.value} role="presentation">
                                <button
                                    type="button"
                                    role="option"
                                    aria-selected={isSelected}
                                    className={cn(
                                        'ui-select-item light-select__item relative flex w-full cursor-default select-none items-center rounded-lg py-2 pl-8 pr-2 text-sm outline-none hover:bg-surface hover:text-primary focus:bg-surface focus:text-primary',
                                        isSelected && 'bg-surface/60 text-primary',
                                        isPinned && 'light-select__item--pinned',
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
