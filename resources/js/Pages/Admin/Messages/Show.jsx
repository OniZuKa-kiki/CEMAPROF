import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Mail, Send, Trash2 } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent } from '@/Components/ui/card';
import { Textarea } from '@/Components/ui/textarea';
import { Label } from '@/Components/ui/label';

export default function MessageShow({ message }) {
    const { flash } = usePage().props;
    const mailtoUrl = `mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject)}&body=${encodeURIComponent(`Bonjour ${message.name},\n\n`)}`;

    const { data, setData, post, processing, errors, reset } = useForm({
        body: `Bonjour ${message.name},\n\n`,
    });

    const toggleRead = () => router.patch(`/admin/messages/${message.id}/toggle-read`, {}, { preserveScroll: true });
    const destroy = () => {
        if (confirm('Supprimer ce message ?')) {
            router.delete(`/admin/messages/${message.id}`);
        }
    };

    const sendReply = (e) => {
        e.preventDefault();
        post(`/admin/messages/${message.id}/reply`, {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <AdminLayout title="Détail du message">
            <Head title="Message — Admin" />

            <Button variant="ghost" className="mb-6" asChild>
                <Link href="/admin/messages"><ArrowLeft className="mr-2 h-4 w-4" />Retour</Link>
            </Button>

            <Card className="mx-auto max-w-3xl border-0 shadow-card">
                <CardContent className="space-y-6 p-6 sm:p-8">
                    {flash?.success && (
                        <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{flash.success}</p>
                    )}

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

                    <form onSubmit={sendReply} className="space-y-3 rounded-xl border border-gray-100 bg-gray-50/80 p-4">
                        <Label htmlFor="reply-body">Répondre par email (SMTP)</Label>
                        <Textarea
                            id="reply-body"
                            rows={6}
                            value={data.body}
                            onChange={(e) => setData('body', e.target.value)}
                            className="bg-white"
                        />
                        {errors.body && <p className="text-sm text-accent">{errors.body}</p>}
                        <div className="flex flex-wrap gap-3">
                            <Button type="submit" disabled={processing}>
                                <Send className="mr-2 h-4 w-4" />
                                {processing ? 'Envoi...' : 'Envoyer la réponse'}
                            </Button>
                            <Button type="button" variant="outline" asChild>
                                <a href={mailtoUrl}><Mail className="mr-2 h-4 w-4" />Ouvrir dans ma messagerie</a>
                            </Button>
                        </div>
                    </form>

                    <div className="flex flex-wrap gap-3">
                        <Button variant="outline" onClick={toggleRead}>{message.is_read ? 'Marquer non lu' : 'Marquer lu'}</Button>
                        <Button variant="ghost" onClick={destroy}><Trash2 className="mr-2 h-4 w-4 text-accent" />Supprimer</Button>
                    </div>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
