import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/ProductCard';
import PageCta from '@/Components/PageCta';
import { PageHero } from '@/Components/PageHero';
import { Pagination } from '@/Components/ui/pagination';

export default function CategoryShow({ category, products }) {
    return (
        <MainLayout>
            <Head title={`${category.name} — CEMAPROF`}>
                <meta head-key="description" name="description" content={category.description || `Découvrez nos produits ${category.name} chez CEMAPROF.`} />
            </Head>

            <PageHero
                title={category.name}
                subtitle={category.description}
                eyebrow="Catégorie"
                breadcrumb={[
                    { label: 'Produits', href: '/produits' },
                    { label: category.name },
                ]}
            />

            <div className="container-wide section-py">
                {category.image_url && (
                    <div className="mb-12 overflow-hidden rounded-2xl shadow-card">
                        <img
                            src={category.image_url}
                            alt={category.name}
                            className="h-48 w-full object-cover sm:h-64"
                            loading="lazy"
                        />
                    </div>
                )}

                <p className="mb-8 text-muted-foreground">
                    {products.total} produit{products.total > 1 ? 's' : ''} dans cette catégorie
                </p>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.data.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="mt-12">
                    <Pagination links={products.links} />
                </div>
            </div>

            <PageCta />
        </MainLayout>
    );
}
