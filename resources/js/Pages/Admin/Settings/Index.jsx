import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Label } from '@/Components/ui/label';
import { Card, CardContent } from '@/Components/ui/card';

function SettingsSection({ title, hint, children }) {
    return (
        <section className="admin-settings-section">
            <h3 className="admin-settings-section__title">{title}</h3>
            {hint && <p className="admin-settings-section__hint">{hint}</p>}
            <div className="space-y-5">{children}</div>
        </section>
    );
}

export default function SettingsIndex({ settings }) {
    const { data, setData, put, processing, errors } = useForm({
        site_name: settings.site_name || '',
        site_tagline: settings.site_tagline || '',
        company_description: settings.company_description || '',
        activity_lines: settings.activity_lines || '',
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
        google_maps_url: settings.google_maps_url || '',
        google_maps_embed: settings.google_maps_embed || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put('/admin/settings');
    };

    return (
        <AdminLayout title="Paramètres">
            <Head title="Paramètres — Admin" />

            <Card className="mx-auto max-w-3xl border-0 shadow-card">
                <CardContent className="p-6 sm:p-8">
                    <form onSubmit={submit} className="space-y-2">
                        <SettingsSection
                            title="Identité du site"
                            hint="Nom, slogan et description affichés sur l'accueil, le pied de page et la page À propos."
                        >
                            <div className="space-y-2">
                                <Label>Nom du site *</Label>
                                <Input value={data.site_name} onChange={(e) => setData('site_name', e.target.value)} />
                                {errors.site_name && <p className="text-sm text-accent">{errors.site_name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Slogan</Label>
                                <Input value={data.site_tagline} onChange={(e) => setData('site_tagline', e.target.value)} placeholder="Importateur · Distributeur" />
                            </div>
                            <div className="space-y-2">
                                <Label>Description entreprise</Label>
                                <Textarea
                                    rows={4}
                                    value={data.company_description}
                                    onChange={(e) => setData('company_description', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Activités (section « Nos activités »)</Label>
                                <Textarea
                                    rows={6}
                                    value={data.activity_lines}
                                    onChange={(e) => setData('activity_lines', e.target.value)}
                                    placeholder={'Une activité par ligne\nEx. Outillage & matériel industriel'}
                                />
                                <p className="text-xs text-muted-foreground">Une ligne = une carte sur la page À propos.</p>
                            </div>
                        </SettingsSection>

                        <SettingsSection title="Contact">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Téléphone</Label>
                                    <Input value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email principal</Label>
                                    <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                    <p className="text-xs text-muted-foreground">Affiché sur le site et utilisé pour les notifications.</p>
                                </div>
                            </div>
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Email commercial</Label>
                                    <Input type="email" value={data.email_secondary} onChange={(e) => setData('email_secondary', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email devis</Label>
                                    <Input type="email" value={data.email_tertiary} onChange={(e) => setData('email_tertiary', e.target.value)} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Adresse</Label>
                                <Textarea rows={2} value={data.address} onChange={(e) => setData('address', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>WhatsApp (numéro sans +)</Label>
                                <Input value={data.whatsapp} onChange={(e) => setData('whatsapp', e.target.value)} placeholder="212600000000" />
                            </div>
                            <div className="space-y-2">
                                <Label>Horaires d&apos;ouverture</Label>
                                <Input value={data.opening_hours} onChange={(e) => setData('opening_hours', e.target.value)} />
                            </div>
                        </SettingsSection>

                        <SettingsSection title="Réseaux sociaux">
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
                        </SettingsSection>

                        <SettingsSection
                            title="Google Maps"
                            hint="Lien « Voir sur Google Maps » et carte intégrée sur la page Contact."
                        >
                            <div className="space-y-2">
                                <Label>Lien Google Maps</Label>
                                <Input value={data.google_maps_url} onChange={(e) => setData('google_maps_url', e.target.value)} placeholder="https://www.google.com/maps/place/..." />
                            </div>
                            <div className="space-y-2">
                                <Label>URL embed (iframe)</Label>
                                <Input value={data.google_maps_embed} onChange={(e) => setData('google_maps_embed', e.target.value)} placeholder="https://www.google.com/maps/embed?pb=..." />
                            </div>
                        </SettingsSection>

                        <Button type="submit" disabled={processing} className="mt-4 w-full sm:w-auto">
                            {processing ? 'Enregistrement...' : 'Enregistrer les paramètres'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
