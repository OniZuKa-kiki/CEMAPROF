import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Download, FileSpreadsheet, Upload } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';

export default function ProductImport({ categories, columns }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({ file: null });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/products-import', { forceFormData: true });
    };

    return (
        <AdminLayout title="Importer des produits">
            <Head title="Import produits — Admin" />

            <Button variant="ghost" className="mb-6" asChild>
                <Link href="/admin/products"><ArrowLeft className="mr-2 h-4 w-4" />Retour aux produits</Link>
            </Button>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-0 shadow-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Upload className="h-5 w-5 text-primary" />
                            Importer un fichier CSV
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <input
                                    type="file"
                                    accept=".csv,text/csv"
                                    onChange={(e) => setData('file', e.target.files[0])}
                                    className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-primary/90"
                                />
                                {errors.file && <p className="mt-2 text-sm text-accent">{errors.file}</p>}
                            </div>
                            <Button type="submit" disabled={processing || !data.file}>
                                {processing ? 'Import en cours...' : 'Lancer l\'import'}
                            </Button>
                        </form>

                        {flash?.import_errors?.length > 0 && (
                            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                                <p className="mb-2 text-sm font-semibold text-amber-800">Détails de l&apos;import :</p>
                                <ul className="max-h-48 space-y-1 overflow-y-auto text-xs text-amber-900">
                                    {flash.import_errors.map((err, i) => (
                                        <li key={i}>• {err}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileSpreadsheet className="h-5 w-5 text-primary" />
                            Comment préparer votre fichier
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-muted-foreground">
                        <p>
                            Utilisez Excel ou Google Sheets, puis exportez en <strong className="text-foreground">CSV</strong> (séparateur point-virgule recommandé).
                        </p>

                        <Button variant="outline" asChild>
                            <a href="/admin/products-import/template">
                                <Download className="mr-2 h-4 w-4" />
                                Télécharger le modèle CSV
                            </a>
                        </Button>

                        <div>
                            <p className="mb-2 font-medium text-foreground">Colonnes du fichier :</p>
                            <ul className="space-y-1">
                                {columns.map((col) => (
                                    <li key={col}><code className="rounded bg-surface px-1.5 py-0.5 text-xs">{col}</code></li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <p className="mb-2 font-medium text-foreground">Catégories existantes :</p>
                            <ul className="flex flex-wrap gap-2">
                                {categories.map((c) => (
                                    <li key={c.id} className="rounded-full bg-surface px-2.5 py-0.5 text-xs">{c.name}</li>
                                ))}
                            </ul>
                        </div>

                        <p className="text-xs">
                            <strong>Badge :</strong> aucun, nouveau, populaire, promo — <strong>Actif / Vedette :</strong> 1 ou 0 — Les doublons (même nom) sont ignorés. Les images peuvent être ajoutées après via l&apos;édition du produit.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
