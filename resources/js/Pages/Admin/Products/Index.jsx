import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Edit, FileUp, Plus, Trash2 } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { AdminFilterBar, AdminFilterControls, AdminFilterReset, AdminFilterSearch } from '@/Components/Admin/AdminFilterBar';
import AdminSelect from '@/Components/Admin/AdminSelect';
import { Button } from '@/Components/ui/button';
import { Switch } from '@/Components/ui/switch';
import { Badge } from '@/Components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Pagination } from '@/Components/ui/pagination';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { availabilityLabels, badgeLabels } from '@/lib/utils';

const sortOptions = [
    { value: 'recent', label: 'Plus récents' },
    { value: 'name', label: 'Nom A → Z' },
    { value: 'name_desc', label: 'Nom Z → A' },
];

const perPageOptions = [
    { value: '25', label: '25 / page' },
    { value: '50', label: '50 / page' },
    { value: '100', label: '100 / page' },
];

const statusOptions = [
    { value: 'all', label: 'Tous statuts' },
    { value: 'active', label: 'Actifs' },
    { value: 'inactive', label: 'Inactifs' },
];

export default function ProductsIndex({ products, categories, filters }) {
    const [deleteId, setDeleteId] = useState(null);
    const [search, setSearch] = useState(filters.search || '');

    const applyFilters = (newFilters) => {
        router.get('/admin/products', { ...filters, ...newFilters, page: 1 }, { preserveState: true });
    };

    const toggle = (id, field) => {
        router.patch(`/admin/products/${id}/toggle-${field}`, {}, { preserveScroll: true, preserveState: true });
    };

    const confirmDelete = () => {
        router.delete(`/admin/products/${deleteId}`, {
            preserveScroll: true,
            onFinish: () => setDeleteId(null),
        });
    };

    const categoryOptions = [
        { value: 'all', label: 'Toutes catégories' },
        ...categories.map((c) => ({ value: String(c.id), label: c.name })),
    ];

    const badgeOptions = [
        { value: 'all', label: 'Tous badges' },
        ...Object.entries(badgeLabels).map(([value, label]) => ({ value, label })),
    ];

    const hasActiveFilters = Boolean(
        filters.search
        || filters.category_id
        || filters.badge
        || filters.status
        || (filters.sort && filters.sort !== 'recent')
        || (filters.per_page && String(filters.per_page) !== '25'),
    );

    return (
        <AdminLayout title="Produits">
            <Head title="Produits — Admin" />

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{products.total}</span> produit{products.total > 1 ? 's' : ''} au total
                    {products.last_page > 1 && (
                        <> — page {products.current_page} / {products.last_page}</>
                    )}
                </p>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/admin/products-import"><FileUp className="mr-2 h-4 w-4" />Importer CSV</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/admin/products/create"><Plus className="mr-2 h-4 w-4" />Nouveau produit</Link>
                    </Button>
                </div>
            </div>

            <AdminFilterBar>
                <AdminFilterSearch
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onSubmit={() => applyFilters({ search: search.trim() || undefined })}
                    placeholder="Rechercher par nom..."
                />
                <AdminFilterControls>
                    <AdminSelect
                        ariaLabel="Filtrer par catégorie"
                        value={filters.category_id || 'all'}
                        onValueChange={(v) => applyFilters({ category_id: v === 'all' ? undefined : v })}
                        options={categoryOptions}
                        searchable={categories.length >= 12}
                        className="admin-select__trigger--category"
                    />
                    <AdminSelect
                        ariaLabel="Filtrer par badge"
                        value={filters.badge || 'all'}
                        onValueChange={(v) => applyFilters({ badge: v === 'all' ? undefined : v })}
                        options={badgeOptions}
                    />
                    <AdminSelect
                        ariaLabel="Filtrer par statut"
                        value={filters.status || 'all'}
                        onValueChange={(v) => applyFilters({ status: v === 'all' ? undefined : v })}
                        options={statusOptions}
                    />
                    <AdminSelect
                        ariaLabel="Trier les produits"
                        value={filters.sort || 'recent'}
                        onValueChange={(v) => applyFilters({ sort: v })}
                        options={sortOptions}
                    />
                    <AdminSelect
                        ariaLabel="Produits par page"
                        value={String(filters.per_page || 25)}
                        onValueChange={(v) => applyFilters({ per_page: v })}
                        options={perPageOptions}
                    />
                </AdminFilterControls>
                <AdminFilterReset
                    visible={hasActiveFilters}
                    onClick={() => {
                        setSearch('');
                        router.get('/admin/products', {}, { preserveState: true });
                    }}
                />
            </AdminFilterBar>

            <div className="overflow-hidden rounded-2xl border bg-white shadow-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Produit</TableHead>
                            <TableHead>Catégorie</TableHead>
                            <TableHead>Marque</TableHead>
                            <TableHead>Disponibilité</TableHead>
                            <TableHead>Badge</TableHead>
                            <TableHead>Actif</TableHead>
                            <TableHead>Phare</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                                    Aucun produit trouvé. Modifiez les filtres ou importez un fichier CSV.
                                </TableCell>
                            </TableRow>
                        ) : products.data.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        {product.image_url ? (
                                            <img src={product.image_url} alt="" className="h-10 w-10 rounded-lg object-cover" />
                                        ) : (
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface text-xs text-muted-foreground">—</div>
                                        )}
                                        <span className="font-medium">{product.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{product.category?.name}</TableCell>
                                <TableCell>{product.brand || '—'}</TableCell>
                                <TableCell>
                                    {product.availability ? (
                                        <Badge
                                            variant={
                                                product.availability === 'on_sale'
                                                    ? 'promo'
                                                    : product.availability === 'out_of_stock'
                                                        ? 'accent'
                                                        : 'default'
                                            }
                                        >
                                            {availabilityLabels[product.availability] ?? product.availability}
                                        </Badge>
                                    ) : '—'}
                                </TableCell>
                                <TableCell>{product.badge ? <Badge variant={product.badge === 'populaire' ? 'accent' : 'default'}>{badgeLabels[product.badge]}</Badge> : '—'}</TableCell>
                                <TableCell><Switch checked={product.is_active} onCheckedChange={() => toggle(product.id, 'active')} /></TableCell>
                                <TableCell><Switch checked={product.is_featured} onCheckedChange={() => toggle(product.id, 'featured')} /></TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" asChild><Link href={`/admin/products/${product.id}/edit`}><Edit className="h-4 w-4" /></Link></Button>
                                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(product.id)}><Trash2 className="h-4 w-4 text-accent" /></Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {products.last_page > 1 && (
                <div className="mt-4">
                    <Pagination links={products.links} />
                </div>
            )}

            <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Supprimer ce produit ?</DialogTitle>
                        <DialogDescription>Cette action est irréversible.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteId(null)}>Annuler</Button>
                        <Button variant="accent" onClick={confirmDelete}>Supprimer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
