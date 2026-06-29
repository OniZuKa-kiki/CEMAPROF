import { Head, useForm } from '@inertiajs/react';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Label } from '@/Components/ui/label';
import { Card, CardContent } from '@/Components/ui/card';
import AdminSelect from '@/Components/Admin/AdminSelect';
import { faqIconOptions } from '@/lib/faqIcons';
import { FaqIcon } from '@/Components/FaqIcon';

function renderFaqIconOption(option) {
    return (
        <span className="faq-icon-option">
            <span className="faq-icon-option__badge">
                <FaqIcon name={option.value} className="h-4 w-4" />
            </span>
            <span>{option.label}</span>
        </span>
    );
}

function emptyItem() {
    return { icon: 'products', q: '', a: '' };
}

export default function ContentFaq({ items: initialItems }) {
    const { data, setData, put, processing, errors } = useForm({
        items: initialItems?.length ? initialItems : [emptyItem()],
    });

    const updateItem = (index, field, value) => {
        const next = [...data.items];
        next[index] = { ...next[index], [field]: value };
        setData('items', next);
    };

    const moveItem = (index, direction) => {
        const next = [...data.items];
        const target = index + direction;
        if (target < 0 || target >= next.length) {
            return;
        }
        [next[index], next[target]] = [next[target], next[index]];
        setData('items', next);
    };

    const submit = (e) => {
        e.preventDefault();
        put('/admin/content/faq');
    };

    return (
        <AdminLayout title="FAQ">
            <Head title="FAQ — Admin" />

            <Card className="mx-auto max-w-4xl border-0 shadow-card">
                <CardContent className="space-y-6 p-6 sm:p-8">
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">Questions fréquentes</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Contenu affiché sur la page publique FAQ.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        {data.items.map((item, index) => (
                            <div key={index} className="admin-content-item">
                                <div className="admin-content-item__header">
                                    <span className="text-sm font-semibold text-foreground">Question {index + 1}</span>
                                    <div className="flex gap-1">
                                        <Button type="button" variant="ghost" size="icon" onClick={() => moveItem(index, -1)} disabled={index === 0}>
                                            <ChevronUp className="h-4 w-4" />
                                        </Button>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => moveItem(index, 1)} disabled={index === data.items.length - 1}>
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setData('items', data.items.filter((_, i) => i !== index))}
                                            disabled={data.items.length <= 1}
                                        >
                                            <Trash2 className="h-4 w-4 text-accent" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-[12rem_1fr]">
                                    <div className="space-y-2">
                                        <Label>Icône</Label>
                                        <AdminSelect
                                            ariaLabel="Icône de la question"
                                            value={item.icon}
                                            onValueChange={(v) => updateItem(index, 'icon', v)}
                                            options={faqIconOptions}
                                            renderTrigger={(selected) => renderFaqIconOption(selected ?? { value: 'products', label: 'Produits' })}
                                            renderItem={(option) => renderFaqIconOption(option)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Question</Label>
                                        <Input
                                            value={item.q}
                                            onChange={(e) => updateItem(index, 'q', e.target.value)}
                                            placeholder="Ex. Livrez-vous partout au Maroc ?"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Réponse</Label>
                                    <Textarea
                                        rows={3}
                                        value={item.a}
                                        onChange={(e) => updateItem(index, 'a', e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}

                        <Button type="button" variant="outline" onClick={() => setData('items', [...data.items, emptyItem()])}>
                            <Plus className="mr-2 h-4 w-4" />
                            Ajouter une question
                        </Button>

                        {errors.items && <p className="text-sm text-accent">{errors.items}</p>}

                        <div className="flex justify-end border-t pt-5">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Enregistrement…' : 'Enregistrer la FAQ'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
