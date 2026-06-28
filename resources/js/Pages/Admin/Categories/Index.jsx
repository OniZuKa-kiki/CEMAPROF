import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent } from '@/Components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';

export default function CategoriesIndex({ categories }) {
    const [deleteCat, setDeleteCat] = useState(null);

    const confirmDelete = () => {
        router.delete(`/admin/categories/${deleteCat.id}`, {
            onFinish: () => setDeleteCat(null),
        });
    };

    return (
        <AdminLayout title="Catégories">
            <Head title="Catégories — Admin" />

            <div className="mb-6 flex justify-end">
                <Button asChild><Link href="/admin/categories/create"><Plus className="mr-2 h-4 w-4" />Nouvelle catégorie</Link></Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((cat) => (
                    <Card key={cat.id} className="overflow-hidden border-0 shadow-card">
                        {cat.image_url && (
                            <img src={cat.image_url} alt={cat.name} className="h-36 w-full object-cover" />
                        )}
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <h3 className="font-semibold">{cat.name}</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">{cat.products_count} produit{cat.products_count > 1 ? 's' : ''}</p>
                                </div>
                                <Badge variant={cat.is_active ? 'default' : 'secondary'}>{cat.is_active ? 'Active' : 'Inactive'}</Badge>
                            </div>
                            {cat.description && <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{cat.description}</p>}
                            <div className="mt-4 flex gap-2">
                                <Button variant="outline" size="sm" asChild><Link href={`/admin/categories/${cat.id}/edit`}><Edit className="mr-1 h-3 w-3" />Modifier</Link></Button>
                                <Button variant="ghost" size="sm" onClick={() => setDeleteCat(cat)} disabled={cat.products_count > 0}>
                                    <Trash2 className="h-3 w-3 text-accent" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={!!deleteCat} onOpenChange={() => setDeleteCat(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Supprimer « {deleteCat?.name} » ?</DialogTitle>
                        <DialogDescription>Cette action est irréversible.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteCat(null)}>Annuler</Button>
                        <Button variant="accent" onClick={confirmDelete}>Supprimer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
