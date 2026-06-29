import { Head, useForm } from '@inertiajs/react';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Label } from '@/Components/ui/label';
import { Card, CardContent } from '@/Components/ui/card';

function emptySection() {
    return { title: '', content: '' };
}

export default function ContentCgv({ sections: initialSections }) {
    const { data, setData, put, processing, errors } = useForm({
        sections: initialSections?.length ? initialSections : [emptySection()],
    });

    const updateSection = (index, field, value) => {
        const next = [...data.sections];
        next[index] = { ...next[index], [field]: value };
        setData('sections', next);
    };

    const moveSection = (index, direction) => {
        const next = [...data.sections];
        const target = index + direction;
        if (target < 0 || target >= next.length) {
            return;
        }
        [next[index], next[target]] = [next[target], next[index]];
        setData('sections', next);
    };

    const submit = (e) => {
        e.preventDefault();
        put('/admin/content/cgv');
    };

    return (
        <AdminLayout title="CGV">
            <Head title="CGV — Admin" />

            <Card className="mx-auto max-w-4xl border-0 shadow-card">
                <CardContent className="space-y-6 p-6 sm:p-8">
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">Conditions générales de vente</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Textes légaux affichés sur la page CGV du site.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        {data.sections.map((section, index) => (
                            <div key={index} className="admin-content-item">
                                <div className="admin-content-item__header">
                                    <span className="text-sm font-semibold text-foreground">Section {index + 1}</span>
                                    <div className="flex gap-1">
                                        <Button type="button" variant="ghost" size="icon" onClick={() => moveSection(index, -1)} disabled={index === 0}>
                                            <ChevronUp className="h-4 w-4" />
                                        </Button>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => moveSection(index, 1)} disabled={index === data.sections.length - 1}>
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setData('sections', data.sections.filter((_, i) => i !== index))}
                                            disabled={data.sections.length <= 1}
                                        >
                                            <Trash2 className="h-4 w-4 text-accent" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Titre</Label>
                                    <Input
                                        value={section.title}
                                        onChange={(e) => updateSection(index, 'title', e.target.value)}
                                        placeholder="Ex. 1. Objet"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Contenu</Label>
                                    <Textarea
                                        rows={4}
                                        value={section.content}
                                        onChange={(e) => updateSection(index, 'content', e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}

                        <Button type="button" variant="outline" onClick={() => setData('sections', [...data.sections, emptySection()])}>
                            <Plus className="mr-2 h-4 w-4" />
                            Ajouter une section
                        </Button>

                        {errors.sections && <p className="text-sm text-accent">{errors.sections}</p>}

                        <div className="flex justify-end border-t pt-5">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Enregistrement…' : 'Enregistrer les CGV'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
