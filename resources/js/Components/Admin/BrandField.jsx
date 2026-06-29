import { useEffect, useId, useRef, useState } from 'react';
import { PenLine } from 'lucide-react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import AdminSelect from '@/Components/Admin/AdminSelect';
import { cn } from '@/lib/utils';

export default function BrandField({ value, onChange, brandOptions = [], error }) {
    const inputId = useId();
    const customInputRef = useRef(null);
    const [customMode, setCustomMode] = useState(() => Boolean(value && !brandOptions.includes(value)));

    useEffect(() => {
        if (value && !brandOptions.includes(value)) {
            setCustomMode(true);
        }
    }, [value, brandOptions]);

    const selectValue = customMode
        ? '__none__'
        : (value && brandOptions.includes(value) ? value : '__none__');

    const handleSelect = (next) => {
        if (next === '__none__') {
            if (!customMode) {
                onChange('');
            }
            return;
        }

        setCustomMode(false);
        onChange(next);
    };

    const openCustomMode = () => {
        setCustomMode(true);
        if (!value || brandOptions.includes(value)) {
            onChange('');
        }
        requestAnimationFrame(() => customInputRef.current?.focus());
    };

    const selectOptions = [
        { value: '__none__', label: 'Aucune marque' },
        ...brandOptions.map((name) => ({ value: name, label: name })),
    ];

    return (
        <div className="brand-field space-y-3">
            <Label>Marque</Label>

            <div className="brand-field__controls">
                <AdminSelect
                    ariaLabel="Choisir une marque existante"
                    value={selectValue}
                    onValueChange={handleSelect}
                    options={selectOptions}
                    searchable={brandOptions.length >= 12}
                    className="brand-field__select"
                />
                <Button
                    type="button"
                    variant={customMode ? 'default' : 'outline'}
                    size="sm"
                    className={cn('brand-field__custom-btn', customMode && 'brand-field__custom-btn--active')}
                    onClick={openCustomMode}
                >
                    <PenLine className="h-4 w-4" />
                    Autre marque
                </Button>
            </div>

            {customMode && (
                <div className="brand-field__custom">
                    <Label htmlFor={inputId}>Nom de la marque</Label>
                    <Input
                        ref={customInputRef}
                        id={inputId}
                        list={`${inputId}-options`}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Saisir le nom de la marque…"
                    />
                    <datalist id={`${inputId}-options`}>
                        {brandOptions.map((name) => (
                            <option key={name} value={name} />
                        ))}
                    </datalist>
                    <p className="text-xs text-muted-foreground">
                        Saisissez une marque qui n&apos;est pas encore dans la liste.
                    </p>
                </div>
            )}

            {error && <p className="text-sm text-accent">{error}</p>}
        </div>
    );
}
