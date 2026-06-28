import { Head, router } from '@inertiajs/react';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { smoothScrollToTop } from '@/lib/smoothScroll';

import {

    ArrowDownAZ,

    ArrowDownWideNarrow,

    ArrowUpAZ,

    ArrowUpDown,

    ArrowUpWideNarrow,

    Clock,

    Filter,

    LayoutGrid,

    List,

    PackageX,

    Sparkles,

    Tag,

    TrendingUp,

} from 'lucide-react';

import MainLayout from '@/Layouts/MainLayout';

import ProductCard from '@/Components/ProductCard';

import ProductListRow from '@/Components/ProductListRow';

import ProductSearchInput from '@/Components/ProductSearchInput';

import { PageHero } from '@/Components/PageHero';

import { Button } from '@/Components/ui/button';

import LightSelect from '@/Components/LightSelect';

import { Pagination } from '@/Components/ui/pagination';

import PageCta from '@/Components/PageCta';

import { badgeLabels } from '@/lib/utils';

import { cn } from '@/lib/utils';



const SORT_OPTIONS = [

    { value: 'recent', label: 'Plus récents', icon: Clock },

    { value: 'price_asc', label: 'Prix croissant', icon: ArrowUpWideNarrow },

    { value: 'price_desc', label: 'Prix décroissant', icon: ArrowDownWideNarrow },

    { value: 'name', label: 'Nom A → Z', icon: ArrowDownAZ },

    { value: 'name_desc', label: 'Nom Z → A', icon: ArrowUpAZ },

    { value: 'popular', label: 'Populaires d\'abord', icon: TrendingUp },

    { value: 'promo', label: 'Promos en premier', icon: Tag },

    { value: 'nouveau', label: 'Nouveautés', icon: Sparkles },

];



const VIEW_STORAGE_KEY = 'cemaprof-catalog-view';



function CatalogFilterBar({ categories, filters, onFilterChange, onSearch }) {

    const [search, setSearch] = useState(filters.search || '');

    const currentSort = String(filters?.sort ?? 'recent');



    useEffect(() => {

        setSearch(filters.search || '');

    }, [filters.search]);



    const selectedIds = filters?.category_id
        ? String(filters.category_id).split(',').map((id) => id.trim()).filter(Boolean)
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

        onFilterChange({ badge: filters?.badge === value ? undefined : value });

    };



    return (

        <div className="catalog-filter-bar">

            <div className="catalog-filter-bar__top">

                <ProductSearchInput

                    value={search}

                    onChange={setSearch}

                    onSubmit={(query) => onSearch(query || undefined)}

                    className="catalog-filter-bar__search"

                    inputClassName="catalog-filter-bar__search-input"

                />



                <div className="catalog-sort-wrapper">

                    <LightSelect

                        value={currentSort}

                        onValueChange={(value) => onFilterChange({ sort: value })}

                        ariaLabel="Trier les produits"

                        triggerClassName="catalog-sort-trigger"

                        contentClassName="catalog-sort-content"

                        options={SORT_OPTIONS.map((opt) => ({

                            value: opt.value,

                            label: opt.label,

                            icon: opt.icon,

                        }))}

                        renderTrigger={(selected) => (

                            <>

                                <ArrowUpDown className="catalog-sort-trigger__icon" aria-hidden="true" />

                                <span className="catalog-sort-trigger__label">{selected?.label ?? 'Trier'}</span>

                            </>

                        )}

                        renderItem={(option) => {

                            const Icon = option.icon;

                            return (

                                <span className="catalog-sort-item__inner">

                                    {Icon && <Icon className="catalog-sort-item__icon" aria-hidden="true" />}

                                    {option.label}

                                </span>

                            );

                        }}

                    />

                </div>

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

                                filters?.badge === value && 'filter-badge-chip--active',

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

    const [viewMode, setViewMode] = useState('grid');

    const [catalogBusy, setCatalogBusy] = useState(false);

    const catalogResultsKey = [

        filters?.search,

        filters?.category_id,

        filters?.badge,

        filters?.sort,

        products?.current_page,

    ].join('|');



    const visitCatalog = (params, { scrollToTop = false } = {}) => {

        setCatalogBusy(true);

        router.get('/produits', { ...filters, ...params, page: params.page ?? 1 }, {

            preserveState: true,

            preserveScroll: !scrollToTop,

            only: ['products', 'filters'],

            onFinish: () => {

                setCatalogBusy(false);

                if (scrollToTop) {

                    smoothScrollToTop(800);

                }

            },

        });

    };



    const handlePageNavigate = (url) => {

        setCatalogBusy(true);

        router.visit(url, {

            preserveState: true,

            preserveScroll: true,

            only: ['products', 'filters'],

            onFinish: () => {

                setCatalogBusy(false);

                smoothScrollToTop(800);

            },

        });

    };



    useEffect(() => {

        const saved = localStorage.getItem(VIEW_STORAGE_KEY);

        if (saved === 'grid' || saved === 'list') {

            setViewMode(saved);

        }

    }, []);



    const setView = (mode) => {

        setViewMode(mode);

        localStorage.setItem(VIEW_STORAGE_KEY, mode);

    };



    const applyFilters = (newFilters) => {

        visitCatalog({ ...newFilters, page: 1 });

    };



    const resetFilters = () => {

        setCatalogBusy(true);

        router.get('/produits', {}, {

            preserveState: true,

            only: ['products', 'filters'],

            onFinish: () => setCatalogBusy(false),

        });

    };



    return (

        <MainLayout>

            <Head title="Nos Produits — Catalogue CEMAPROF">

                <meta head-key="description" name="description" content="Catalogue CEMAPROF : outillage, matériel industriel et agricole, tuyauterie, pompes, EPI, quincaillerie et droguerie." />

            </Head>



            <PageHero

                title="Nos Produits"

                subtitle="Outillage, industrie, agriculture, tuyauterie & quincaillerie"

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



                    <div className="catalog-view-toggle" role="group" aria-label="Mode d'affichage">

                        <button

                            type="button"

                            className={cn('catalog-view-toggle__btn', viewMode === 'grid' && 'catalog-view-toggle__btn--active')}

                            onClick={() => setView('grid')}

                            aria-pressed={viewMode === 'grid'}

                            aria-label="Affichage en grille"

                        >

                            <LayoutGrid className="h-4 w-4" />

                            <span className="hidden sm:inline">Grille</span>

                        </button>

                        <button

                            type="button"

                            className={cn('catalog-view-toggle__btn', viewMode === 'list' && 'catalog-view-toggle__btn--active')}

                            onClick={() => setView('list')}

                            aria-pressed={viewMode === 'list'}

                            aria-label="Affichage en liste"

                        >

                            <List className="h-4 w-4" />

                            <span className="hidden sm:inline">Liste</span>

                        </button>

                    </div>

                </div>



                <div className={cn('catalog-results min-w-0', catalogBusy && 'catalog-results--busy')}>

                    <AnimatePresence mode="wait">

                        {products.data.length > 0 ? (

                            <motion.div

                                key={catalogResultsKey}

                                className="catalog-results__inner"

                                initial={{ opacity: 0, y: 10 }}

                                animate={{ opacity: 1, y: 0 }}

                                exit={{ opacity: 0, y: -6 }}

                                transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}

                            >

                                {viewMode === 'grid' ? (

                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">

                                        {products.data.map((product) => (

                                            <ProductCard key={product.id} product={product} />

                                        ))}

                                    </div>

                                ) : (

                                    <div className="catalog-list-view space-y-4">

                                        {products.data.map((product) => (

                                            <ProductListRow key={product.id} product={product} />

                                        ))}

                                    </div>

                                )}

                                <div className="pagination mt-12">

                                    <Pagination links={products.links} onNavigate={handlePageNavigate} />

                                </div>

                            </motion.div>

                        ) : (

                            <motion.div

                                key="catalog-empty"

                                className="flex flex-col items-center justify-center rounded-2xl border bg-white py-20 text-center shadow-card"

                                initial={{ opacity: 0 }}

                                animate={{ opacity: 1 }}

                                exit={{ opacity: 0 }}

                                transition={{ duration: 0.28 }}

                            >

                                <PackageX className="mb-4 h-16 w-16 text-muted-foreground/50" />

                                <h3 className="text-xl font-semibold text-foreground">Aucun produit trouvé</h3>

                                <p className="mt-2 text-muted-foreground">Essayez de modifier vos filtres de recherche.</p>

                                <Button className="mt-6" onClick={resetFilters}>Réinitialiser les filtres</Button>

                            </motion.div>

                        )}

                    </AnimatePresence>

                </div>

            </div>



            <PageCta />

        </MainLayout>

    );

}


