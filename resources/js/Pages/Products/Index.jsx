import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    ArrowDownAZ,
    ArrowUpAZ,
    ArrowUpDown,
    Clock,
    Filter,
    PackageX,
    Search,
    SlidersHorizontal,
    Sparkles,
    Tag,
    TrendingUp,
    X,
} from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/ProductCard';
import { PageHero } from '@/Components/PageHero';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Checkbox } from '@/Components/ui/checkbox';
import { Label } from '@/Components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { Pagination } from '@/Components/ui/pagination';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/Components/ui/sheet';
import PageCta from '@/Components/PageCta';
import { badgeLabels } from '@/lib/utils';
import { cn } from '@/lib/utils';

const SORT_OPTIONS = [
    { value: 'recent', label: 'Plus récents', icon: Clock },
    { value: 'name', label: 'Nom A → Z', icon: ArrowDownAZ },
    { value: 'name_desc', label: 'Nom Z → A', icon: ArrowUpAZ },
    { value: 'popular', label: 'Populaires d\'abord', icon: TrendingUp },
    { value: 'promo', label: 'Promos en premier', icon: Tag },
    { value: 'nouveau', label: 'Nouveautés', icon: Sparkles },
];

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

function CatalogFilterBar({ categories, filters, onFilterChange, onSearch }) {
    const [search, setSearch] = useState(filters.search || '');
    const currentSort = String(filters?.sort ?? 'recent');

    useEffect(() => {
        setSearch(filters.search || '');
    }, [filters.search]);

    const selectedIds = filters.category_id
        ? String(filters.category_id).split(',').filter(Boolean)
        : [];

    const selectCategory = (id) => {
        if (id === null) {
            onFilterChange({ category_id: undefined });
            return;
        }
        const idStr = String(id);
        onFilterChange({
            category_id: selectedIds.includes(idStr) && selectedIds.length === 1
                ? undefined
                : idStr,
        });
    };

    const toggleBadge = (value) => {
        onFilterChange({ badge: filters.badge === value ? undefined : value });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        onSearch(search.trim() || undefined);
    };

    return (
        <div className="catalog-filter-bar">
            <div className="catalog-filter-bar__top">
                <form onSubmit={handleSearchSubmit} className="catalog-filter-bar__search">
                    <Search className="catalog-filter-bar__search-icon" aria-hidden="true" />
                    <input
                        type="search"
                        className="catalog-filter-bar__search-input"
                        placeholder="Rechercher un produit..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </form>

                <Select
                    value={currentSort}
                    onValueChange={(value) => onFilterChange({ sort: value })}
                >
                    <SelectTrigger className="catalog-sort-trigger" aria-label="Trier les produits">
                        <ArrowUpDown className="catalog-sort-trigger__icon" aria-hidden="true" />
                        <SelectValue placeholder="Trier" />
                    </SelectTrigger>
                    <SelectContent className="catalog-sort-content" align="end">
                        {SORT_OPTIONS.map((opt) => {
                            const Icon = opt.icon;
                            return (
                                <SelectItem key={opt.value} value={opt.value} className="catalog-sort-item">
                                    <span className="catalog-sort-item__inner">
                                        <Icon className="catalog-sort-item__icon" aria-hidden="true" />
                                        {opt.label}
                                    </span>
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            </div>

            <div className="catalog-filter-bar__group">
                <span className="catalog-filter-bar__label">
                    <Filter className="h-3.5 w-3.5" aria-hidden="true" />
                    Catégories
                </span>
                <div className="catalog-filter-bar__chips custom-scrollbar">
                    <button
                        type="button"
                        className={cn('filter-chip', selectedIds.length === 0 && 'filter-chip--active')}
                        onClick={() => selectCategory(null)}
                    >
                        Tous
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            className={cn(
                                'filter-chip',
                                selectedIds.includes(String(cat.id)) && 'filter-chip--active',
                            )}
                            onClick={() => selectCategory(cat.id)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="catalog-filter-bar__group">
                <span className="catalog-filter-bar__label">Badges</span>
                <div className="catalog-filter-bar__badges">
                    {Object.entries(badgeLabels).map(([value, label]) => (
                        <button
                            key={value}
                            type="button"
                            className={cn(
                                'filter-badge-chip',
                                `filter-badge-chip--${value}`,
                                filters.badge === value && 'filter-badge-chip--active',
                            )}
                            onClick={() => toggleBadge(value)}
                        >
                            <span className="filter-badge-chip__dot" aria-hidden="true" />
                            {label}
                        </button>
                    ))}
                </div>
            </div>
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
                <CatalogFilterBar
                    categories={categories}
                    filters={filters}
                    onFilterChange={applyFilters}
                    onSearch={(search) => applyFilters({ search })}
                />

                <div className="mb-6 mt-4 flex flex-wrap items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">{products.total}</span> produit{products.total > 1 ? 's' : ''} trouvé{products.total > 1 ? 's' : ''}
                    </p>
                    <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="sm" className="lg:hidden">
                                <SlidersHorizontal className="mr-2 h-4 w-4" />
                                Badges
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] overflow-y-auto">
                            <SheetHeader>
                                <SheetTitle className="flex items-center gap-2">
                                    <Filter className="h-5 w-5" />
                                    Filtres avancés
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
                </div>

                <div className="flex gap-8">
                    <aside className="hidden w-56 shrink-0 lg:block">
                        <div className="sticky top-24 filter-sidebar">
                            <h3 className="mb-4 font-semibold text-foreground">Filtres avancés</h3>
                            <FilterSidebar
                                categories={categories}
                                filters={filters}
                                onFilterChange={applyFilters}
                                onReset={resetFilters}
                            />
                        </div>
                    </aside>

                    <div className="flex-1 min-w-0">
                        {products.data.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
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
