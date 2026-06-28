import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Switch } from '@/Components/ui/switch';
import { Card, CardContent } from '@/Components/ui/card';
import { slugify, badgeLabels } from '@/lib/utils';

export default function ProductForm({ product, categories }) {
    const isEdit = !!product;

    const { data, setData, post, put, processing, errors } = useForm({
        name: product?.name || '',
        slug: product?.slug || '',
        category_id: product?.category_id ? String(product.category_id) : '',
        short_description: product?.short_description || '',
        description: product?.description || '',
        price: product?.price != null ? String(product.price) : '',
        badge: product?.badge || '',
        is_featured: product?.is_featured ?? false,
        is_active: product?.is_active ?? true,
        image: null,
        gallery: [],
        remove_gallery: [],
    });

    const [slugManual, setSlugManual] = useState(isEdit);
    const [preview, setPreview] = useState(product?.image_url || null);
    const [existingGallery, setExistingGallery] = useState(product?.images || []);

    useEffect(() => {
        if (!slugManual && data.name) {
            setData('slug', slugify(data.name));
        }
    }, [data.name, slugManual]);

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleGallery = (e) => {
        setData('gallery', Array.from(e.target.files));
    };

    const removeExistingImage = (url) => {
        setExistingGallery((prev) => prev.filter((img) => img !== url));
        setData('remove_gallery', [...data.remove_gallery, url]);
    };

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/products/${product.id}`, { forceFormData: true });
        } else {
            post('/admin/products', { forceFormData: true });
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Modifier le produit' : 'Nouveau produit'}>
            <Head title={isEdit ? 'Modifier produit' : 'Nouveau produit'} />

            <Button variant="ghost" className="mb-6" asChild>
                <Link href="/admin/products"><ArrowLeft className="mr-2 h-4 w-4" />Retour</Link>
            </Button>

            <form onSubmit={submit}>
                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card className="border-0 shadow-card">
                            <CardContent className="space-y-5 p-6">
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
                                    <Label>Catégorie *</Label>
                                    <Select value={data.category_id} onValueChange={(v) => setData('category_id', v)}>
                                        <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                                        <SelectContent>
                                            {categories.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    {errors.category_id && <p className="text-sm text-accent">{errors.category_id}</p>}
                                </div>
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Description courte</Label>
                                        <Input value={data.short_description} onChange={(e) => setData('short_description', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Prix indicatif (MAD)</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="Ex. 12500"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                        />
                                        {errors.price && <p className="text-sm text-accent">{errors.price}</p>}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Description complète</Label>
                                    <Textarea rows={6} value={data.description} onChange={(e) => setData('description', e.target.value)} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="border-0 shadow-card">
                            <CardContent className="space-y-5 p-6">
                                <div className="space-y-2">
                                    <Label>Image principale</Label>
                                    {preview && <img src={preview} alt="" className="mb-2 h-32 w-full rounded-xl object-cover" />}
                                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed p-4 text-sm text-muted-foreground hover:bg-gray-50">
                                        <Upload className="h-4 w-4" />
                                        Choisir une image
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
                                    </label>
                                </div>
                                <div className="space-y-2">
                                    <Label>Galerie (ajouter)</Label>
                                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed p-4 text-sm text-muted-foreground hover:bg-gray-50">
                                        <Upload className="h-4 w-4" />
                                        Ajouter des images
                                        <input type="file" accept="image/*" multiple className="hidden" onChange={handleGallery} />
                                    </label>
                                    {existingGallery.length > 0 && (
                                        <div className="grid grid-cols-3 gap-2">
                                            {existingGallery.map((img) => (
                                                <div key={img} className="relative">
                                                    <img src={img} alt="" className="h-16 w-full rounded-lg object-cover" />
                                                    <button type="button" onClick={() => removeExistingImage(img)} className="absolute -right-1 -top-1 rounded-full bg-accent p-0.5 text-white">
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label>Badge</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Étiquette affichée sur la fiche produit. Reste jusqu&apos;à ce que vous la changiez manuellement.
                                    </p>
                                    <Select value={data.badge || 'none'} onValueChange={(v) => setData('badge', v === 'none' ? '' : v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Aucun</SelectItem>
                                            {Object.entries(badgeLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <Label>Produit vedette</Label>
                                        <p className="text-xs text-muted-foreground">Affiché sur la page d&apos;accueil</p>
                                    </div>
                                    <Switch checked={data.is_featured} onCheckedChange={(v) => setData('is_featured', v)} />
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <Label>Actif</Label>
                                        <p className="text-xs text-muted-foreground">Visible sur le site public</p>
                                    </div>
                                    <Switch checked={data.is_active} onCheckedChange={(v) => setData('is_active', v)} />
                                </div>
                                <Button type="submit" className="w-full" disabled={processing}>
                                    {processing ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer le produit'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
