import { useCallback, useEffect, useState } from 'react';
import { formatPrice } from '@/lib/utils';

const STORAGE_KEY = 'cemaprof-quote-products';

function normalizeItem(product) {
    if (!product?.slug) {
        return null;
    }

    return {
        slug: product.slug,
        name: product.name,
        quantity: Math.max(1, Number(product.quantity) || 1),
        price: product.price ?? null,
    };
}

function readCart() {
    if (typeof window === 'undefined') {
        return [];
    }

    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed)
            ? parsed.map((item) => normalizeItem(item)).filter(Boolean)
            : [];
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
        const item = normalizeItem(product);
        if (!item) {
            return false;
        }

        const current = readCart();
        const existingIndex = current.findIndex((entry) => entry.slug === item.slug);

        if (existingIndex >= 0) {
            const next = [...current];
            next[existingIndex] = {
                ...next[existingIndex],
                quantity: item.quantity,
                price: item.price ?? next[existingIndex].price,
            };
            writeCart(next);
            setItems(next);
            return true;
        }

        const next = [...current, item];
        writeCart(next);
        setItems(next);
        return true;
    }, []);

    const updateQuantity = useCallback((slug, quantity) => {
        const qty = Math.max(1, Number(quantity) || 1);
        const next = readCart().map((item) =>
            item.slug === slug ? { ...item, quantity: qty } : item,
        );
        writeCart(next);
        setItems(next);
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
        const next = list.map((item) => normalizeItem(item)).filter(Boolean);
        writeCart(next);
        setItems(next);
    }, []);

    return {
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        setItemsFromList,
        count: items.length,
    };
}

export function buildQuoteContactUrl(items) {
    if (!items?.length) {
        return '/contact?subject=devis';
    }

    const products = items
        .map((item) => (item.quantity > 1 ? `${item.slug}:${item.quantity}` : item.slug))
        .join(',');

    return `/contact?products=${encodeURIComponent(products)}&subject=devis`;
}

export function buildWhatsAppProductMessage(product, quantity = 1) {
    const qtyLine = quantity > 1 ? ` (quantité : ${quantity})` : '';
    const priceLine = product.price != null ? `\nPrix indicatif : ${formatPrice(product.price)}` : '';

    return `Bonjour CEMAPROF, je souhaite commander / obtenir un devis pour :\n- ${product.name}${qtyLine}${priceLine}`;
}
