import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Mail, Trash2 } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent } from '@/Components/ui/card';

export default function MessageShow({ message }) {
    const replyUrl = `mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject)}&body=${encodeURIComponent(`Bonjour ${message.name},\n\n`)}`;

    const toggleRead = () => router.patch(`/admin/messages/${message.id}/toggle-read`, {}, { preserveScroll: true });
    const destroy = () => {
        if (confirm('Supprimer ce message ?')) {
            router.delete(`/admin/messages/${message.id}`);
        }
    };

    return (
        <AdminLayout title="Détail du message">
            <Head title="Message — Admin" />

            <Button variant="ghost" className="mb-6" asChild>
                <Link href="/admin/messages"><ArrowLeft className="mr-2 h-4 w-4" />Retour</Link>
            </Button>

            <Card className="mx-auto max-w-3xl border-0 shadow-card">
                <CardContent className="space-y-6 p-6 sm:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold">{message.subject}</h2>
                            <p className="text-sm text-muted-foreground">{new Date(message.created_at).toLocaleString('fr-FR')}</p>
                        </div>
                        <Badge variant={message.is_read ? 'secondary' : 'accent'}>{message.is_read ? 'Lu' : 'Non lu'}</Badge>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div><p className="text-xs text-muted-foreground">Nom</p><p className="font-medium">{message.name}</p></div>
                        <div><p className="text-xs text-muted-foreground">Email</p><p className="font-medium">{message.email}</p></div>
                        {message.phone && <div><p className="text-xs text-muted-foreground">Téléphone</p><p className="font-medium">{message.phone}</p></div>}
                        {message.company && <div><p className="text-xs text-muted-foreground">Entreprise</p><p className="font-medium">{message.company}</p></div>}
                        {message.product_slug && (
                            <div>
                                <p className="text-xs text-muted-foreground">Produit(s)</p>
                                <p className="font-medium">
                                    {message.product_slugs?.length
                                        ? message.product_slugs.join(', ')
                                        : message.product_slug}
                                </p>
                            </div>
                        )}
                    </div>

                    <div>
                        <p className="mb-2 text-xs text-muted-foreground">Message</p>
                        <p className="whitespace-pre-line rounded-xl bg-gray-50 p-4 text-sm leading-relaxed">{message.message}</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button asChild><a href={replyUrl}><Mail className="mr-2 h-4 w-4" />Répondre</a></Button>
                        <Button variant="outline" onClick={toggleRead}>{message.is_read ? 'Marquer non lu' : 'Marquer lu'}</Button>
                        <Button variant="ghost" onClick={destroy}><Trash2 className="mr-2 h-4 w-4 text-accent" />Supprimer</Button>
                    </div>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
