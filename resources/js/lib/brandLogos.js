/**
 * Marques industrielles — logos dans public/images/brands/
 * `file`  : nom exact du fichier local
 * `scale` : compensation du padding interne du PNG (1 = référence)
 */
export const partnerBrands = [
    { name: 'Bosch', slug: 'bosch', file: 'bosch.png', scale: 1 },
    { name: 'Makita', slug: 'makita', file: 'makita.png', scale: 1 },
    { name: 'DeWalt', slug: 'dewalt', file: 'dewalt.png', scale: 1 },
    { name: 'Stanley', slug: 'stanley', file: 'stanley.png', scale: 1 },
    { name: 'Facom', slug: 'facom', file: 'facom.png', scale: 1 },
    { name: 'Schneider', slug: 'schneider', file: 'Schneider.png', scale: 1.7 },
    { name: 'Grundfos', slug: 'grundfos', file: 'grundfos.png', scale: 2.3 },
    { name: 'Kärcher', slug: 'karcher', file: 'karcher.png', scale: 2 },
    { name: '3M', slug: '3m', file: '3m.png', scale: 1 },
    { name: 'Hitachi', slug: 'hitachi', file: 'hitachi.png', scale: 1.35 },
    { name: 'Metabo', slug: 'metabo', file: 'metabo.png', scale: 1.55 },
    { name: 'Würth', slug: 'wurth', file: 'wurth.png', scale: 1.85 },
    { name: 'Nilfisk', slug: 'nilfisk', file: 'nilfisk.png', scale: 2.1 },
    { name: 'Festool', slug: 'festool', file: 'festool.png', scale: 1.95 },
    { name: 'Knipex', slug: 'knipex', file: 'knipex.png', scale: 1.15 },
    { name: 'Bahco', slug: 'bahco', file: 'bahco.png', scale: 1 },
    { name: 'Legrand', slug: 'legrand', file: 'legrand.png', scale: 1.9 },
    { name: 'Hilti', slug: 'hilti', file: 'hilti.png', scale: 1 },
    { name: 'Saint-Gobain', slug: 'saint-gobain', file: 'saint-gobain.png', scale: 1.85 },
];

export function getBrandLogoSources(brand) {
    const file = brand.file || `${brand.slug}.png`;

    return [`/images/brands/${encodeURIComponent(file)}`];
}

export function getBrandScale(brand) {
    return brand.scale ?? 1;
}
