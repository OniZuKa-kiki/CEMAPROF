const AVAILABILITY_MAP = {
    in_stock: 'https://schema.org/InStock',
    out_of_stock: 'https://schema.org/OutOfStock',
    on_promotion: 'https://schema.org/InStock',
};

export function buildProductSchema(product, canonicalUrl) {
    if (!product?.name || !canonicalUrl) {
        return null;
    }

    const images = product.all_images?.length
        ? product.all_images
        : product.image_url
            ? [product.image_url]
            : undefined;

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        url: canonicalUrl,
        sku: product.slug,
    };

    const description = product.short_description
        || (typeof product.description === 'string' ? product.description.slice(0, 500) : null);

    if (description) {
        schema.description = description;
    }

    if (images?.length) {
        schema.image = images;
    }

    if (product.brand) {
        schema.brand = {
            '@type': 'Brand',
            name: product.brand,
        };
    }

    if (product.category?.name) {
        schema.category = product.category.name;
    }

    const offer = {
        '@type': 'Offer',
        url: canonicalUrl,
        priceCurrency: 'MAD',
        availability: AVAILABILITY_MAP[product.availability] || AVAILABILITY_MAP.in_stock,
    };

    if (product.price != null) {
        offer.price = Number(product.price);
    }

    schema.offers = offer;

    return schema;
}

export function buildOrganizationSchema({ appUrl, company, siteSettings = {} }) {
    const name = siteSettings.site_name || 'CEMAPROF';

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name,
        url: appUrl,
        logo: `${appUrl}/images/logo.png`,
        description: company?.description || company?.short_description,
    };

    if (siteSettings.phone) {
        schema.telephone = siteSettings.phone;
    }

    if (siteSettings.email) {
        schema.email = siteSettings.email;
    }

    if (siteSettings.address) {
        schema.address = {
            '@type': 'PostalAddress',
            streetAddress: siteSettings.address,
            addressCountry: 'MA',
        };
    }

    return schema;
}

export function buildWebSiteSchema(appUrl) {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'CEMAPROF',
        url: appUrl,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${appUrl}/produits?search={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    };
}
