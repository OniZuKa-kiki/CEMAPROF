import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Filter, PackageX, Search, SlidersHorizontal, X } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/ProductCard';
import { PageHero } from '@/Components/PageHero';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Checkbox } from '@/Components/ui/checkbox';
import { Label } from '@/Components/ui/label';
import { NativeSelect } from '@/Components/ui/native-select';
import { Pagination } from '@/Components/ui/pagination';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/Components/ui/sheet';
import PageCta from '@/Components/PageCta';
import { badgeLabels } from '@/lib/utils';

function FilterSidebar({ categories, filters, onFilterChange, onReset }) {
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        setSearch(filters.search || '');
    }, [filters.search]);

    const selectedCategories = filters.category_id
        ? String(filters.category_id).split(',').filter(Boolean)
        : [];

    const toggleCategory = (id) => {
        const idStr = String(id);
        const updated = selectedCategories.includes(idStr)
            ? selectedCategories.filter((c) => c !== idStr)
            : [...selectedCategories, idStr];
        onFilterChange({ category_id: updated.length ? updated.join(',') : undefined });
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                    <Search className="h-4 w-4 text-primary" />
                    Recherche
                </h3>
                <Input
                    placeholder="Nom du produit..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onFilterChange({ search: search.trim() || undefined });
                        }
                    }}
                />
                <Button variant="outline" size="sm" className="mt-2 w-full" onClick={() => onFilterChange({ search: search.trim() || undefined })}>
                    Rechercher
                </Button>
            </div>

            <div>
                <h3 className="mb-4 font-semibold text-foreground">Catégories</h3>
                <div className="space-y-3">
                    {categories.map((cat) => (
                        <div key={cat.id} className="flex items-center gap-3">
                            <Checkbox
                                id={`cat-${cat.id}`}
                                checked={selectedCategories.includes(String(cat.id))}
                                onCheckedChange={() => toggleCategory(cat.id)}
                            />
                            <Label htmlFor={`cat-${cat.id}`} className="cursor-pointer text-sm font-normal">
                                {cat.name}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="mb-4 font-semibold text-foreground">Badge</h3>
                <div className="space-y-3">
                    {Object.entries(badgeLabels).map(([value, label]) => (
                        <div key={value} className="flex items-center gap-3">
                            <Checkbox
                                id={`badge-${value}`}
                                checked={filters.badge === value}
                                onCheckedChange={(checked) =>
                                    onFilterChange({ badge: checked ? value : undefined })
                                }
                            />
                            <Label htmlFor={`badge-${value}`} className="cursor-pointer text-sm font-normal">
                                {label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <Button variant="outline" className="w-full" onClick={onReset}>
                <X className="mr-2 h-4 w-4" />
                Réinitialiser
            </Button>
        </div>
    );
}

export default function ProductsIndex({ products, categories, filters }) {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const applyFilters = (newFilters) => {
        router.get('/produits', { ...filters, ...newFilters, page: 1 }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilters = () => {
        router.get('/produits', {}, { preserveState: true });
    };

    const handleSort = (sort) => {
        applyFilters({ sort });
    };

    return (
        <MainLayout>
            <Head title="Nos Produits — Catalogue Matériel Professionnel">
                <meta head-key="description" name="description" content="Découvrez notre catalogue complet de matériel professionnel : cuisine pro, nettoyage, hôtellerie, bureau, outillage et mobilier." />
            </Head>

            <PageHero
                title="Nos Produits"
                subtitle="Parcourez notre catalogue de matériel professionnel"
                eyebrow="Catalogue"
                breadcrumb={[{ label: 'Produits' }]}
            />

            <div className="container-wide section-py">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">{products.total}</span> produit{products.total > 1 ? 's' : ''} trouvé{products.total > 1 ? 's' : ''}
                    </p>
                    <div className="flex items-center gap-3">
                        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="lg:hidden">
                                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                                    Filtres
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] overflow-y-auto">
                                <SheetHeader>
                                    <SheetTitle className="flex items-center gap-2">
                                        <Filter className="h-5 w-5" />
                                        Filtres
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="mt-6">
                                    <FilterSidebar
                                        categories={categories}
                                        filters={filters}
                                        onFilterChange={(f) => { applyFilters(f); setMobileFiltersOpen(false); }}
                                        onReset={() => { resetFilters(); setMobileFiltersOpen(false); }}
                                    />
                                </div>
                            </SheetContent>
                        </Sheet>

                        <NativeSelect
                            value={String(filters?.sort ?? 'recent')}
                            onChange={(e) => handleSort(e.target.value)}
                            className="w-[180px]"
                        >
                            <option value="recent">Plus récents</option>
                            <option value="name">A-Z</option>
                            <option value="popular">Populaires</option>
                        </NativeSelect>
                    </div>
                </div>

                <div className="flex gap-8">
                    <aside className="hidden w-64 shrink-0 lg:block">
                        <div className="sticky top-28 filter-sidebar">
                            <FilterSidebar
                                categories={categories}
                                filters={filters}
                                onFilterChange={applyFilters}
                                onReset={resetFilters}
                            />
                        </div>
                    </aside>

                    <div className="flex-1">
                        {products.data.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                    {products.data.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                                <div className="pagination mt-12">
                                    <Pagination links={products.links} />
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center rounded-2xl border bg-white py-20 text-center shadow-card">
                                <PackageX className="mb-4 h-16 w-16 text-muted-foreground/50" />
                                <h3 className="text-xl font-semibold text-foreground">Aucun produit trouvé</h3>
                                <p className="mt-2 text-muted-foreground">Essayez de modifier vos filtres de recherche.</p>
                                <Button className="mt-6" onClick={resetFilters}>Réinitialiser les filtres</Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <PageCta />
        </MainLayout>
    );
}
