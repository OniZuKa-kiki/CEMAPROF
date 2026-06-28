import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'cemaprof-quote-products';

function readCart() {
    if (typeof window === 'undefined') {
        return [];
    }

    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function writeCart(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('quote-cart-updated', { detail: items }));
}

export function useQuoteCart() {
    const [items, setItems] = useState(readCart);

    useEffect(() => {
        const sync = () => setItems(readCart());
        window.addEventListener('quote-cart-updated', sync);
        window.addEventListener('storage', sync);
        return () => {
            window.removeEventListener('quote-cart-updated', sync);
            window.removeEventListener('storage', sync);
        };
    }, []);

    const addItem = useCallback((product) => {
        if (!product?.slug) {
            return false;
        }

        const current = readCart();
        if (current.some((item) => item.slug === product.slug)) {
            return false;
        }

        const next = [...current, { slug: product.slug, name: product.name }];
        writeCart(next);
        setItems(next);
        return true;
    }, []);

    const removeItem = useCallback((slug) => {
        const next = readCart().filter((item) => item.slug !== slug);
        writeCart(next);
        setItems(next);
    }, []);

    const clearCart = useCallback(() => {
        writeCart([]);
        setItems([]);
    }, []);

    const setItemsFromList = useCallback((list) => {
        const next = list.filter((item) => item?.slug && item?.name);
        writeCart(next);
        setItems(next);
    }, []);

    return { items, addItem, removeItem, clearCart, setItemsFromList, count: items.length };
}

export function buildQuoteContactUrl(items) {
    if (!items?.length) {
        return '/contact?subject=devis';
    }

    const slugs = items.map((item) => item.slug).join(',');
    return `/contact?products=${encodeURIComponent(slugs)}&subject=devis`;
}
