import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Edit, FileUp, Plus, Trash2 } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Switch } from '@/Components/ui/switch';
import { Badge } from '@/Components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Pagination } from '@/Components/ui/pagination';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { badgeLabels } from '@/lib/utils';

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

            <div className="mb-6 flex flex-wrap gap-3">
                <Input
                    placeholder="Rechercher par nom..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-52"
                    onKeyDown={(e) => e.key === 'Enter' && applyFilters({ search: search.trim() || undefined })}
                />
                <Button variant="outline" size="sm" onClick={() => applyFilters({ search: search.trim() || undefined })}>
                    Rechercher
                </Button>
                <Select value={filters.category_id || 'all'} onValueChange={(v) => applyFilters({ category_id: v === 'all' ? undefined : v })}>
                    <SelectTrigger className="w-44"><SelectValue placeholder="Catégorie" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Toutes catégories</SelectItem>
                        {categories.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select value={filters.badge || 'all'} onValueChange={(v) => applyFilters({ badge: v === 'all' ? undefined : v })}>
                    <SelectTrigger className="w-36"><SelectValue placeholder="Badge" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous badges</SelectItem>
                        {Object.entries(badgeLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select value={filters.status || 'all'} onValueChange={(v) => applyFilters({ status: v === 'all' ? undefined : v })}>
                    <SelectTrigger className="w-32"><SelectValue placeholder="Statut" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="active">Actifs</SelectItem>
                        <SelectItem value="inactive">Inactifs</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={filters.sort || 'recent'} onValueChange={(v) => applyFilters({ sort: v })}>
                    <SelectTrigger className="w-40"><SelectValue placeholder="Tri" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="recent">Plus récents</SelectItem>
                        <SelectItem value="name">Nom A → Z</SelectItem>
                        <SelectItem value="name_desc">Nom Z → A</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={String(filters.per_page || 25)} onValueChange={(v) => applyFilters({ per_page: v })}>
                    <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="25">25 / page</SelectItem>
                        <SelectItem value="50">50 / page</SelectItem>
                        <SelectItem value="100">100 / page</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-white shadow-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Produit</TableHead>
                            <TableHead>Catégorie</TableHead>
                            <TableHead>Badge</TableHead>
                            <TableHead>Actif</TableHead>
                            <TableHead>Vedette</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
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
