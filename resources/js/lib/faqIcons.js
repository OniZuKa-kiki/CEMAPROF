import {
    CreditCard,
    HelpCircle,
    MapPin,
    MessageCircle,
    Package,
    Truck,
} from 'lucide-react';

export const faqIconMap = {
    products: Package,
    quote: MessageCircle,
    pricing: CreditCard,
    delivery: Truck,
    location: MapPin,
    advice: HelpCircle,
    payment: CreditCard,
};

export const faqIconOptions = [
    { value: 'products', label: 'Produits' },
    { value: 'quote', label: 'Devis' },
    { value: 'pricing', label: 'Tarifs' },
    { value: 'delivery', label: 'Livraison' },
    { value: 'location', label: 'Localisation' },
    { value: 'advice', label: 'Conseil' },
    { value: 'payment', label: 'Paiement' },
];
