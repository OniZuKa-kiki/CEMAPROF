import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Eye } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { AdminFilterBar, AdminFilterControls, AdminFilterReset, AdminFilterSearch } from '@/Components/Admin/AdminFilterBar';
import AdminSelect from '@/Components/Admin/AdminSelect';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Pagination } from '@/Components/ui/pagination';
import { subjectOptions } from '@/lib/utils';

const subjectLabels = Object.fromEntries(subjectOptions.map((o) => [o.value, o.label]));

const subjectFilterOptions = [
    { value: 'all', label: 'Tous les sujets' },
    ...subjectOptions,
];

const sortOptions = [
    { value: 'recent', label: 'Plus récents' },
    { value: 'oldest', label: 'Plus anciens' },
    { value: 'name', label: 'Nom A → Z' },
    { value: 'name_desc', label: 'Nom Z → A' },
];

const perPageOptions = [
    { value: '25', label: '25 / page' },
    { value: '50', label: '50 / page' },
    { value: '100', label: '100 / page' },
];

export default function MessagesIndex({ messages, filters, counts }) {
    const [search, setSearch] = useState(filters.search || '');

    const applyFilters = (newFilters) => {
        router.get('/admin/messages', { ...filters, ...newFilters, page: 1 }, { preserveState: true });
    };

    const hasActiveFilters = Boolean(
        filters.search
        || filters.subject
        || (filters.sort && filters.sort !== 'recent')
        || (filters.per_page && String(filters.per_page) !== '25'),
    );

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
                className="mb-4"
            >
                <TabsList>
                    <TabsTrigger value="all">Tous ({counts.all})</TabsTrigger>
                    <TabsTrigger value="unread">Non lus ({counts.unread})</TabsTrigger>
                    <TabsTrigger value="read">Lus ({counts.read})</TabsTrigger>
                </TabsList>
            </Tabs>

            <AdminFilterBar>
                <AdminFilterSearch
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onSubmit={() => applyFilters({ search: search.trim() || undefined })}
                    placeholder="Rechercher (nom, email, message...)"
                />
                <AdminFilterControls>
                    <AdminSelect
                        ariaLabel="Filtrer par sujet"
                        value={filters.subject || 'all'}
                        onValueChange={(v) => applyFilters({ subject: v === 'all' ? undefined : v })}
                        options={subjectFilterOptions}
                        placeholder="Sujet"
                    />
                    <AdminSelect
                        ariaLabel="Trier les messages"
                        value={filters.sort || 'recent'}
                        onValueChange={(v) => applyFilters({ sort: v })}
                        options={sortOptions}
                        placeholder="Tri"
                    />
                    <AdminSelect
                        ariaLabel="Messages par page"
                        value={String(filters.per_page || 25)}
                        onValueChange={(v) => applyFilters({ per_page: v })}
                        options={perPageOptions}
                    />
                </AdminFilterControls>
                <AdminFilterReset
                    visible={hasActiveFilters}
                    onClick={() => {
                        setSearch('');
                        router.get('/admin/messages', { tab: filters.tab || 'all' }, { preserveState: true });
                    }}
                />
            </AdminFilterBar>

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
