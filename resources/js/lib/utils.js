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
