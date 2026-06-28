import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function formatWhatsAppUrl(number, message = '') {
    const cleanNumber = String(number).replace(/\D/g, '');
    const encoded = encodeURIComponent(message);
    return message
        ? `https://wa.me/${cleanNumber}?text=${encoded}`
        : `https://wa.me/${cleanNumber}`;
}

export function formatWhatsAppDisplay(number) {
    const digits = String(number).replace(/\D/g, '');

    if (digits.startsWith('212') && digits.length >= 12) {
        const local = `0${digits.slice(3)}`;
        return local.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
    }

    return digits.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
}

export function formatPrice(amount, currency = 'MAD') {
    const num = Number(amount);
    if (Number.isNaN(num)) {
        return null;
    }

    const formatted = new Intl.NumberFormat('fr-MA', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(num);

    return `${formatted} ${currency}`;
}

export const badgeStyles = {
    nouveau: 'bg-primary text-white',
    populaire: 'bg-accent text-white',
    promo: 'bg-emerald-500 text-white',
};

export const badgeLabels = {
    nouveau: 'Nouveau',
    populaire: 'Populaire',
    promo: 'Promo',
};

export const subjectOptions = [
    { value: 'devis', label: 'Demande de devis' },
    { value: 'info-produit', label: 'Information produit' },
    { value: 'sav', label: 'Service après-vente' },
    { value: 'autre', label: 'Autre' },
];

export function slugify(text) {
    return text
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}
