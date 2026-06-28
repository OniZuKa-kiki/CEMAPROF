import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Label } from '@/Components/ui/label';
import { Switch } from '@/Components/ui/switch';
import { Card, CardContent } from '@/Components/ui/card';
import { slugify } from '@/lib/utils';

export default function CategoryForm({ category }) {
    const isEdit = !!category;

    const { data, setData, post, put, processing, errors } = useForm({
        name: category?.name || '',
        slug: category?.slug || '',
        description: category?.description || '',
        is_active: category?.is_active ?? true,
        image: null,
    });

    const [slugManual, setSlugManual] = useState(isEdit);
    const [preview, setPreview] = useState(category?.image_url || null);

    useEffect(() => {
        if (!slugManual && data.name) setData('slug', slugify(data.name));
    }, [data.name, slugManual]);

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/categories/${category.id}`, { forceFormData: true });
        } else {
            post('/admin/categories', { forceFormData: true });
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Modifier la catégorie' : 'Nouvelle catégorie'}>
            <Head title={isEdit ? 'Modifier catégorie' : 'Nouvelle catégorie'} />

            <Button variant="ghost" className="mb-6" asChild>
                <Link href="/admin/categories"><ArrowLeft className="mr-2 h-4 w-4" />Retour</Link>
            </Button>

            <Card className="mx-auto max-w-2xl border-0 shadow-card">
                <CardContent className="space-y-5 p-6">
                    <form onSubmit={submit} className="space-y-5">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Nom *</Label>
                                <Input value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                {errors.name && <p className="text-sm text-accent">{errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Slug *</Label>
                                <Input value={data.slug} onChange={(e) => { setSlugManual(true); setData('slug', e.target.value); }} />
                                {errors.slug && <p className="text-sm text-accent">{errors.slug}</p>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea rows={4} value={data.description} onChange={(e) => setData('description', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Image</Label>
                            {preview && <img src={preview} alt="" className="mb-2 h-32 w-full rounded-xl object-cover" />}
                            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed p-4 text-sm hover:bg-gray-50">
                                <Upload className="h-4 w-4" />Choisir une image
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) { setData('image', file); setPreview(URL.createObjectURL(file)); }
                                }} />
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Active</Label>
                            <Switch checked={data.is_active} onCheckedChange={(v) => setData('is_active', v)} />
                        </div>
                        {isEdit && category.products_count > 0 && (
                            <p className="text-sm text-muted-foreground">{category.products_count} produit(s) lié(s)</p>
                        )}
                        <Button type="submit" disabled={processing} className="w-full">
                            {processing ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
