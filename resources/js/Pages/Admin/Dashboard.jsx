import { Head, Link } from '@inertiajs/react';
import { Eye, Mail, Package, Tags } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { subjectOptions } from '@/lib/utils';

const subjectLabels = Object.fromEntries(subjectOptions.map((o) => [o.value, o.label]));

function KpiCard({ title, value, icon: Icon, color }) {
    return (
        <Card className="border-0 shadow-card">
            <CardContent className="flex items-center gap-4 p-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color}`}>
                    <Icon className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <p className="text-3xl font-bold">{value}</p>
                </div>
            </CardContent>
        </Card>
    );
}

export default function Dashboard({ stats, recentMessages, recentProducts }) {
    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard Admin" />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <KpiCard title="Total produits" value={stats.total_products} icon={Package} color="bg-primary/10 text-primary" />
                <KpiCard title="Produits actifs" value={stats.active_products} icon={Package} color="bg-emerald-50 text-emerald-600" />
                <KpiCard title="Messages non lus" value={stats.unread_messages} icon={Mail} color="bg-accent/10 text-accent" />
                <KpiCard title="Catégories actives" value={stats.active_categories} icon={Tags} color="bg-blue-50 text-blue-600" />
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-2">
                <Card className="border-0 shadow-card">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Derniers messages</CardTitle>
                        <Button variant="ghost" size="sm" asChild><Link href="/admin/messages">Voir tout</Link></Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nom</TableHead>
                                    <TableHead>Sujet</TableHead>
                                    <TableHead>Statut</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentMessages.map((msg) => (
                                    <TableRow key={msg.id}>
                                        <TableCell className="font-medium">{msg.name}</TableCell>
                                        <TableCell>{subjectLabels[msg.subject] || msg.subject}</TableCell>
                                        <TableCell>
                                            <Badge variant={msg.is_read ? 'secondary' : 'accent'}>
                                                {msg.is_read ? 'Lu' : 'Non lu'}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-card">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Derniers produits</CardTitle>
                        <Button variant="ghost" size="sm" asChild><Link href="/admin/products">Voir tout</Link></Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Produit</TableHead>
                                    <TableHead>Catégorie</TableHead>
                                    <TableHead>Statut</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentProducts.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell>{product.category?.name}</TableCell>
                                        <TableCell>
                                            <Badge variant={product.is_active ? 'default' : 'secondary'}>
                                                {product.is_active ? 'Actif' : 'Inactif'}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
