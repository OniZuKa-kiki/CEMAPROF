import { Head, router, useForm } from '@inertiajs/react';
import { ChevronDown, ChevronUp, Plus, Trash2, Upload } from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { getBrandLogoSources, getBrandScale } from '@/lib/brandLogos';

function BrandPreview({ brand, className }) {
    const sources = getBrandLogoSources(brand);

    return (
        <img
            src={sources[0]}
            alt={brand.name}
            className={className ?? 'admin-partner-brand__logo'}
            style={{ transform: `scale(${getBrandScale(brand)})` }}
        />
    );
}

export default function ContentPartnerBrands({ catalog, activeSlugs }) {
    const [deleteSlug, setDeleteSlug] = useState(null);
    const { data, setData, put, processing } = useForm({
        slugs: activeSlugs ?? [],
    });

    const addForm = useForm({
        name: '',
        logo: null,
        scale: '1',
    });

    const toggle = (slug) => {
        if (data.slugs.includes(slug)) {
            setData('slugs', data.slugs.filter((item) => item !== slug));
            return;
        }

        setData('slugs', [...data.slugs, slug]);
    };

    const moveSlug = (slug, direction) => {
        const index = data.slugs.indexOf(slug);
        if (index === -1) {
            return;
        }

        const target = index + direction;
        if (target < 0 || target >= data.slugs.length) {
            return;
        }

        const next = [...data.slugs];
        [next[index], next[target]] = [next[target], next[index]];
        setData('slugs', next);
    };

    const submitSelection = (e) => {
        e.preventDefault();
        put('/admin/content/partner-brands');
    };

    const submitAdd = (e) => {
        e.preventDefault();
        addForm.post('/admin/content/partner-brands/catalog', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => addForm.reset(),
        });
    };

    const confirmDelete = () => {
        if (!deleteSlug) {
            return;
        }

        router.delete(`/admin/content/partner-brands/catalog/${deleteSlug}`, {
            preserveScroll: true,
            onFinish: () => setDeleteSlug(null),
        });
    };

    const activeBrands = data.slugs
        .map((slug) => catalog.find((brand) => brand.slug === slug))
        .filter(Boolean);

    const brandToDelete = catalog.find((brand) => brand.slug === deleteSlug);

    return (
        <AdminLayout title="Marques partenaires">
            <Head title="Marques partenaires — Admin" />

            <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_20rem]">
                <div className="space-y-6">
                    <Card className="border-0 shadow-card">
                        <CardContent className="space-y-4 p-6">
                            <div>
                                <h2 className="text-lg font-semibold text-foreground">Ajouter une marque</h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Nom + logo PNG. La marque sera ajoutée au catalogue ci-dessous.
                                </p>
                            </div>

                            <form onSubmit={submitAdd} className="admin-partner-add space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="partner-brand-name">Nom</Label>
                                        <Input
                                            id="partner-brand-name"
                                            value={addForm.data.name}
                                            onChange={(e) => addForm.setData('name', e.target.value)}
                                            placeholder="Ex. Bosch"
                                        />
                                        {addForm.errors.name && <p className="text-sm text-accent">{addForm.errors.name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="partner-brand-scale">Échelle d&apos;affichage</Label>
                                        <Input
                                            id="partner-brand-scale"
                                            type="number"
                                            min="0.5"
                                            max="4"
                                            step="0.05"
                                            value={addForm.data.scale}
                                            onChange={(e) => addForm.setData('scale', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="partner-brand-logo">Logo PNG</Label>
                                    <label
                                        htmlFor="partner-brand-logo"
                                        className="admin-partner-add__upload"
                                    >
                                        <Upload className="h-4 w-4 shrink-0" />
                                        {addForm.data.logo ? addForm.data.logo.name : 'Choisir un fichier PNG…'}
                                        <input
                                            id="partner-brand-logo"
                                            type="file"
                                            accept="image/png"
                                            className="hidden"
                                            onChange={(e) => addForm.setData('logo', e.target.files?.[0] ?? null)}
                                        />
                                    </label>
                                    {addForm.errors.logo && <p className="text-sm text-accent">{addForm.errors.logo}</p>}
                                </div>

                                <Button type="submit" disabled={addForm.processing}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    {addForm.processing ? 'Ajout…' : 'Ajouter au catalogue'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-card">
                        <CardContent className="space-y-4 p-6">
                            <div>
                                <h2 className="text-lg font-semibold text-foreground">Catalogue de logos</h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Cochez les marques à afficher dans le bandeau défilant de l&apos;accueil.
                                </p>
                            </div>

                            <form onSubmit={submitSelection}>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {catalog.map((brand) => {
                                        const checked = data.slugs.includes(brand.slug);

                                        return (
                                            <div
                                                key={brand.slug}
                                                className={`admin-partner-brand ${checked ? 'admin-partner-brand--active' : ''}`}
                                            >
                                                <label className="admin-partner-brand__select">
                                                    <input
                                                        type="checkbox"
                                                        checked={checked}
                                                        onChange={() => toggle(brand.slug)}
                                                        className="admin-partner-brand__check"
                                                    />
                                                    <span className="admin-partner-brand__visual">
                                                        <BrandPreview brand={brand} />
                                                    </span>
                                                    <span className="admin-partner-brand__name">{brand.name}</span>
                                                </label>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="admin-partner-brand__delete"
                                                    title="Supprimer du catalogue"
                                                    onClick={() => setDeleteSlug(brand.slug)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-accent" />
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-6 flex justify-end lg:hidden">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Enregistrement…' : 'Enregistrer la sélection'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-0 shadow-card lg:sticky lg:top-24 lg:self-start">
                    <CardContent className="space-y-4 p-6">
                        <div>
                            <h3 className="text-sm font-semibold text-foreground">Ordre du bandeau</h3>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {activeBrands.length} marque{activeBrands.length > 1 ? 's' : ''} sélectionnée{activeBrands.length > 1 ? 's' : ''}
                            </p>
                        </div>

                        {activeBrands.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Aucune marque sélectionnée.</p>
                        ) : (
                            <ul className="space-y-2">
                                {activeBrands.map((brand, index) => (
                                    <li key={brand.slug} className="admin-partner-order">
                                        <span className="admin-partner-order__visual">
                                            <BrandPreview brand={brand} className="admin-partner-order__logo" />
                                        </span>
                                        <span className="flex-1 text-sm font-medium">{brand.name}</span>
                                        <div className="flex gap-1">
                                            <Button type="button" variant="ghost" size="icon" onClick={() => moveSlug(brand.slug, -1)} disabled={index === 0}>
                                                <ChevronUp className="h-4 w-4" />
                                            </Button>
                                            <Button type="button" variant="ghost" size="icon" onClick={() => moveSlug(brand.slug, 1)} disabled={index === activeBrands.length - 1}>
                                                <ChevronDown className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <Button
                            type="button"
                            className="w-full"
                            disabled={processing}
                            onClick={() => put('/admin/content/partner-brands')}
                        >
                            {processing ? 'Enregistrement…' : 'Enregistrer'}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={!!deleteSlug} onOpenChange={() => setDeleteSlug(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Supprimer « {brandToDelete?.name} » ?</DialogTitle>
                        <DialogDescription>
                            La marque sera retirée du catalogue et du bandeau. Cette action est irréversible.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteSlug(null)}>Annuler</Button>
                        <Button variant="accent" onClick={confirmDelete}>Supprimer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
