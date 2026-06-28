import { useEffect, useId, useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import { ArrowRight, Loader2, Package, Search } from 'lucide-react';
import InputClearButton from '@/Components/ui/InputClearButton';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function ProductSearchInput({
    value,
    onChange,
    onSubmit,
    placeholder = 'Rechercher un produit...',
    className,
    inputClassName,
    autoFocus = false,
    variant = 'default',
}) {
    const listId = useId();
    const wrapperRef = useRef(null);
    const isUserTypingRef = useRef(false);
    const suppressSuggestionsRef = useRef(false);
    const [suggestions, setSuggestions] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const closeSuggestions = () => {
        setOpen(false);
        setActiveIndex(-1);
    };

    const dismissSuggestions = () => {
        suppressSuggestionsRef.current = true;
        isUserTypingRef.current = false;
        setOpen(false);
        setSuggestions([]);
        setActiveIndex(-1);
        wrapperRef.current?.querySelector('input')?.blur();
    };

    const clearValue = () => {
        suppressSuggestionsRef.current = false;
        isUserTypingRef.current = false;
        onChange('');
        setSuggestions([]);
        setOpen(false);
        setActiveIndex(-1);
        wrapperRef.current?.querySelector('input')?.focus();
    };

    const handleValueChange = (nextValue) => {
        isUserTypingRef.current = true;
        suppressSuggestionsRef.current = false;
        onChange(nextValue);
    };

    const canAutoOpen = () => isUserTypingRef.current && !suppressSuggestionsRef.current;

    useEffect(() => {
        const query = value.trim();

        if (query.length < 2) {
            setSuggestions([]);
            setOpen(false);
            setLoading(false);
            return undefined;
        }

        const timer = window.setTimeout(async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/products/suggest?q=${encodeURIComponent(query)}`);
                if (!response.ok) {
                    setSuggestions([]);
                    return;
                }
                const data = await response.json();
                const items = Array.isArray(data) ? data : [];
                setSuggestions(items);
                setActiveIndex(-1);
                if (canAutoOpen() && items.length > 0) {
                    setOpen(true);
                }
            } catch {
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, 280);

        return () => window.clearTimeout(timer);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                closeSuggestions();
            }
        };

        const removeNavigateListener = router.on('navigate', () => {
            dismissSuggestions();
        });

        const removeFinishListener = router.on('finish', () => {
            dismissSuggestions();
        });

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            removeNavigateListener();
            removeFinishListener();
        };
    }, []);

    const goToProduct = (slug) => {
        dismissSuggestions();
        router.visit(`/produits/${slug}`);
    };

    const goToAllResults = (event) => {
        event.preventDefault();
        const query = value.trim();
        if (!query) {
            return;
        }
        dismissSuggestions();
        router.visit(`/produits?search=${encodeURIComponent(query)}`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const query = value.trim();
        dismissSuggestions();
        if (query) {
            onSubmit?.(query);
        }
    };

    const handleKeyDown = (e) => {
        if (!open || suggestions.length === 0) {
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((index) => (index + 1) % suggestions.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((index) => (index <= 0 ? suggestions.length - 1 : index - 1));
        } else if (e.key === 'Enter' && activeIndex >= 0) {
            e.preventDefault();
            goToProduct(suggestions[activeIndex].slug);
        } else if (e.key === 'Escape') {
            dismissSuggestions();
        }
    };

    const handleFocus = () => {
        if (suppressSuggestionsRef.current) {
            return;
        }
        if (value.trim().length >= 2 && suggestions.length > 0) {
            setOpen(true);
        }
    };

    const showDropdown = open && !suppressSuggestionsRef.current && (suggestions.length > 0 || loading);
    const hasValue = Boolean(value);

    return (
        <div
            ref={wrapperRef}
            className={cn(
                'product-search-input',
                variant === 'navbar' && 'product-search-input--navbar',
                showDropdown && 'product-search-input--open',
                className,
            )}
        >
            <form onSubmit={handleSubmit} className="product-search-input__form" role="search">
                <Search className="product-search-input__icon" aria-hidden="true" />
                <input
                    type="text"
                    inputMode="search"
                    enterKeyHint="search"
                    className={cn(
                        'product-search-input__field',
                        (hasValue || loading) && 'product-search-input__field--has-trailing',
                        inputClassName,
                    )}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => handleValueChange(e.target.value)}
                    onFocus={handleFocus}
                    onKeyDown={handleKeyDown}
                    autoFocus={autoFocus}
                    autoComplete="off"
                    role="combobox"
                    aria-expanded={showDropdown}
                    aria-controls={listId}
                    aria-autocomplete="list"
                />
                <div className="product-search-input__trailing" aria-hidden={!loading && !hasValue}>
                    {loading ? (
                        <Loader2 className="product-search-input__loader animate-spin" />
                    ) : hasValue ? (
                        <InputClearButton onClear={clearValue} />
                    ) : null}
                </div>
            </form>

            {showDropdown && (
                <div className="product-search-suggestions" role="presentation">
                    <div className="product-search-suggestions__header">
                        <Package className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Suggestions produits</span>
                    </div>

                    <ul id={listId} className="product-search-suggestions__list" role="listbox">
                        {loading && suggestions.length === 0 && (
                            <li className="product-search-suggestions__status" role="presentation">
                                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                                Recherche en cours…
                            </li>
                        )}
                        {suggestions.map((item, index) => {
                            const price = item.price != null ? formatPrice(item.price) : null;

                            return (
                                <li key={item.slug} role="option" aria-selected={activeIndex === index}>
                                    <button
                                        type="button"
                                        className={cn(
                                            'product-search-suggestions__item',
                                            activeIndex === index && 'product-search-suggestions__item--active',
                                        )}
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => goToProduct(item.slug)}
                                    >
                                        {item.image_url ? (
                                            <img src={item.image_url} alt="" className="product-search-suggestions__thumb" />
                                        ) : (
                                            <span className="product-search-suggestions__thumb product-search-suggestions__thumb--empty">
                                                <Package className="h-4 w-4" aria-hidden="true" />
                                            </span>
                                        )}
                                        <span className="product-search-suggestions__content">
                                            <span className="product-search-suggestions__name">{item.name}</span>
                                            {item.category?.name && (
                                                <span className="product-search-suggestions__category">
                                                    {item.category.name}
                                                </span>
                                            )}
                                        </span>
                                        {price ? (
                                            <span className="product-search-suggestions__price">{price}</span>
                                        ) : (
                                            <span className="product-search-suggestions__price product-search-suggestions__price--quote">
                                                Sur devis
                                            </span>
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>

                    {value.trim().length >= 2 && (
                        <div className="product-search-suggestions__footer">
                            <button
                                type="button"
                                className="product-search-suggestions__all"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={goToAllResults}
                            >
                                Voir tous les résultats pour « {value.trim()} »
                                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
