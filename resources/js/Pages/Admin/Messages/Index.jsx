import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Eye } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Pagination } from '@/Components/ui/pagination';
import { subjectOptions } from '@/lib/utils';

const subjectLabels = Object.fromEntries(subjectOptions.map((o) => [o.value, o.label]));

export default function MessagesIndex({ messages, filters, counts }) {
    const [search, setSearch] = useState(filters.search || '');

    const applyFilters = (newFilters) => {
        router.get('/admin/messages', { ...filters, ...newFilters, page: 1 }, { preserveState: true });
    };

    return (
        <AdminLayout title="Messages">
            <Head title="Messages — Admin" />

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{messages.total}</span> message{messages.total > 1 ? 's' : ''}
                    {messages.last_page > 1 && (
                        <> — page {messages.current_page} / {messages.last_page}</>
                    )}
                </p>
            </div>

            <Tabs
                value={filters.tab || 'all'}
                onValueChange={(tab) => applyFilters({ tab })}
                className="mb-6"
            >
                <TabsList>
                    <TabsTrigger value="all">Tous ({counts.all})</TabsTrigger>
                    <TabsTrigger value="unread">Non lus ({counts.unread})</TabsTrigger>
                    <TabsTrigger value="read">Lus ({counts.read})</TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="mb-6 flex flex-wrap gap-3">
                <Input
                    placeholder="Rechercher (nom, email, message...)"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-64"
                    onKeyDown={(e) => e.key === 'Enter' && applyFilters({ search: search.trim() || undefined })}
                />
                <Button variant="outline" size="sm" onClick={() => applyFilters({ search: search.trim() || undefined })}>
                    Rechercher
                </Button>
                <Select value={filters.subject || 'all'} onValueChange={(v) => applyFilters({ subject: v === 'all' ? undefined : v })}>
                    <SelectTrigger className="w-48"><SelectValue placeholder="Sujet" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les sujets</SelectItem>
                        {subjectOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={filters.sort || 'recent'} onValueChange={(v) => applyFilters({ sort: v })}>
                    <SelectTrigger className="w-44"><SelectValue placeholder="Tri" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="recent">Plus récents</SelectItem>
                        <SelectItem value="oldest">Plus anciens</SelectItem>
                        <SelectItem value="name">Nom A → Z</SelectItem>
                        <SelectItem value="name_desc">Nom Z → A</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={String(filters.per_page || 25)} onValueChange={(v) => applyFilters({ per_page: v })}>
                    <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="25">25 / page</SelectItem>
                        <SelectItem value="50">50 / page</SelectItem>
                        <SelectItem value="100">100 / page</SelectItem>
                    </SelectContent>
                </Select>
                {(filters.search || filters.subject || filters.sort !== 'recent' || filters.per_page) && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setSearch('');
                            router.get('/admin/messages', { tab: filters.tab || 'all' }, { preserveState: true });
                        }}
                    >
                        Réinitialiser
                    </Button>
                )}
            </div>

            <div className="overflow-hidden rounded-2xl border bg-white shadow-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nom</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Sujet</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {messages.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                                    Aucun message trouvé. Modifiez les filtres ou l&apos;onglet sélectionné.
                                </TableCell>
                            </TableRow>
                        ) : messages.data.map((msg) => (
                            <TableRow key={msg.id} className={!msg.is_read ? 'bg-primary/5' : undefined}>
                                <TableCell className="font-medium">{msg.name}</TableCell>
                                <TableCell>{msg.email}</TableCell>
                                <TableCell>{subjectLabels[msg.subject] || msg.subject}</TableCell>
                                <TableCell>
                                    {new Date(msg.created_at).toLocaleDateString('fr-FR', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={msg.is_read ? 'secondary' : 'accent'}>
                                        {msg.is_read ? 'Lu' : 'Non lu'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={`/admin/messages/${msg.id}`}><Eye className="h-4 w-4" /></Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {messages.last_page > 1 && (
                <div className="mt-4">
                    <Pagination links={messages.links} />
                </div>
            )}
        </AdminLayout>
    );
}
