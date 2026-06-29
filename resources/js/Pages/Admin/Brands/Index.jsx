import { Head, router, useForm } from '@inertiajs/react';
import { Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { matchesSearch } from '@/lib/searchNormalize';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';

export default function BrandsIndex({ brands }) {
    const [deleteBrand, setDeleteBrand] = useState(null);
    const [search, setSearch] = useState('');
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
    });

    const filteredBrands = useMemo(() => {
        const query = search.trim();
        if (!query) {
            return brands;
        }

        return brands.filter((brand) => matchesSearch(brand.name, query));
    }, [brands, search]);

    const submit = (e) => {
        e.preventDefault();
        post('/admin/brands', {
            preserveScroll: true,
            onSuccess: () => reset('name'),
        });
    };

    const confirmDelete = () => {
        if (!deleteBrand) {
            return;
        }

        router.delete(`/admin/brands/${deleteBrand.id}`, {
            preserveScroll: true,
            onFinish: () => setDeleteBrand(null),
        });
    };

    return (
        <AdminLayout title="Marques">
            <Head title="Marques — Admin" />

            <div className="mb-6 grid gap-6 lg:grid-cols-[minmax(0,20rem)_1fr]">
                <form onSubmit={submit} className="admin-filter-bar">
                    <h2 className="text-sm font-semibold text-foreground">Ajouter une marque</h2>
                    <div className="space-y-2">
                        <Label htmlFor="brand-name">Nom</Label>
                        <Input
                            id="brand-name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Ex. Bosch"
                        />
                        {errors.name && <p className="text-sm text-accent">{errors.name}</p>}
                    </div>
                    <Button type="submit" disabled={processing} className="w-full">
                        {processing ? 'Ajout…' : 'Ajouter'}
                    </Button>
                </form>

                <div className="space-y-3">
                    <div className="admin-filter-bar__search">
                        <div className="relative min-w-0 flex-1">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Rechercher une marque…"
                                className="pl-9"
                            />
                        </div>
                        {search && (
                            <Button type="button" variant="ghost" size="sm" onClick={() => setSearch('')}>
                                Effacer
                            </Button>
                        )}
                    </div>

                    <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">{filteredBrands.length}</span>
                        {' '}marque{filteredBrands.length > 1 ? 's' : ''}
                        {search && brands.length !== filteredBrands.length && (
                            <> sur {brands.length}</>
                        )}
                    </p>

                    <div className="max-h-[32rem] overflow-auto rounded-2xl border bg-white shadow-card">
                        <Table>
                            <TableHeader className="sticky top-0 z-[1] bg-white">
                                <TableRow>
                                    <TableHead>Marque</TableHead>
                                    <TableHead>Produits</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredBrands.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="py-12 text-center text-muted-foreground">
                                            {search
                                                ? 'Aucune marque ne correspond à votre recherche.'
                                                : 'Aucune marque enregistrée. Ajoutez-en une ou assignez une marque à un produit.'}
                                        </TableCell>
                                    </TableRow>
                                ) : filteredBrands.map((brand) => (
                                    <TableRow key={brand.id}>
                                        <TableCell className="font-medium">{brand.name}</TableCell>
                                        <TableCell>{brand.products_count}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setDeleteBrand(brand)}
                                                disabled={brand.products_count > 0}
                                                title={brand.products_count > 0 ? 'Retirez la marque des produits avant suppression' : 'Supprimer'}
                                            >
                                                <Trash2 className="h-4 w-4 text-accent" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            <Dialog open={!!deleteBrand} onOpenChange={() => setDeleteBrand(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Supprimer la marque « {deleteBrand?.name} » ?</DialogTitle>
                        <DialogDescription>Cette action est irréversible.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteBrand(null)}>Annuler</Button>
                        <Button variant="accent" onClick={confirmDelete}>Supprimer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
