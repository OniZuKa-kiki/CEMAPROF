import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Label } from '@/Components/ui/label';
import { Card, CardContent } from '@/Components/ui/card';

export default function SettingsIndex({ settings }) {
    const { data, setData, put, processing, errors } = useForm({
        site_name: settings.site_name || '',
        phone: settings.phone || '',
        email: settings.email || '',
        email_secondary: settings.email_secondary || '',
        email_tertiary: settings.email_tertiary || '',
        address: settings.address || '',
        whatsapp: settings.whatsapp || '',
        facebook: settings.facebook || '',
        instagram: settings.instagram || '',
        linkedin: settings.linkedin || '',
        opening_hours: settings.opening_hours || '',
        google_maps_embed: settings.google_maps_embed || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put('/admin/settings');
    };

    return (
        <AdminLayout title="Paramètres">
            <Head title="Paramètres — Admin" />

            <Card className="mx-auto max-w-2xl border-0 shadow-card">
                <CardContent className="p-6 sm:p-8">
                    <form onSubmit={submit} className="space-y-5">
                        <div className="space-y-2">
                            <Label>Nom du site *</Label>
                            <Input value={data.site_name} onChange={(e) => setData('site_name', e.target.value)} />
                            {errors.site_name && <p className="text-sm text-accent">{errors.site_name}</p>}
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Téléphone</Label>
                                <Input value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Email principal (contact &amp; notifications)</Label>
                                <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                <p className="text-xs text-muted-foreground">Affiché sur le site et utilisé pour les alertes email.</p>
                            </div>
                        </div>

                        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 p-4 space-y-4">
                            <p className="text-sm font-medium text-gray-700">Emails secondaires (bientôt)</p>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Email commercial</Label>
                                    <Input
                                        type="email"
                                        value={data.email_secondary}
                                        disabled
                                        className="cursor-not-allowed bg-gray-100 text-gray-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Email devis</Label>
                                    <Input
                                        type="email"
                                        value={data.email_tertiary}
                                        disabled
                                        className="cursor-not-allowed bg-gray-100 text-gray-500"
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Ces champs sont préparés pour une utilisation future. Seul l&apos;email principal est actif pour le moment.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label>Adresse</Label>
                            <Textarea rows={2} value={data.address} onChange={(e) => setData('address', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>WhatsApp (numéro sans +)</Label>
                            <Input value={data.whatsapp} onChange={(e) => setData('whatsapp', e.target.value)} placeholder="212600000000" />
                        </div>
                        <div className="grid gap-5 sm:grid-cols-3">
                            <div className="space-y-2">
                                <Label>Facebook</Label>
                                <Input value={data.facebook} onChange={(e) => setData('facebook', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Instagram</Label>
                                <Input value={data.instagram} onChange={(e) => setData('instagram', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>LinkedIn</Label>
                                <Input value={data.linkedin} onChange={(e) => setData('linkedin', e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Horaires d&apos;ouverture</Label>
                            <Input value={data.opening_hours} onChange={(e) => setData('opening_hours', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Google Maps (URL embed)</Label>
                            <Input value={data.google_maps_embed} onChange={(e) => setData('google_maps_embed', e.target.value)} />
                        </div>
                        <Button type="submit" disabled={processing} className="w-full">
                            {processing ? 'Enregistrement...' : 'Enregistrer les paramètres'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
