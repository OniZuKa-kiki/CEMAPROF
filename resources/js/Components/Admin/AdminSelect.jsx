import LightSelect from '@/Components/LightSelect';
import { cn } from '@/lib/utils';

export default function AdminSelect({
    value,
    onValueChange,
    options = [],
    placeholder = 'Choisir…',
    ariaLabel,
    id,
    className,
    searchable = false,
    pinnedValues = [],
    searchPlaceholder = 'Rechercher…',
    renderTrigger,
    renderItem,
}) {
    const safeValue = value === undefined || value === null || value === '' ? undefined : String(value);

    return (
        <LightSelect
            id={id}
            value={safeValue}
            onValueChange={onValueChange}
            options={options.map((option) => ({
                value: String(option.value),
                label: option.label,
            }))}
            placeholder={placeholder}
            ariaLabel={ariaLabel || placeholder}
            triggerClassName={cn('admin-select__trigger', className)}
            contentClassName="admin-select__content"
            itemClassName="admin-select__item"
            fitContent
            searchable={searchable}
            pinnedValues={pinnedValues}
            searchPlaceholder={searchPlaceholder}
            renderTrigger={renderTrigger}
            renderItem={renderItem}
        />
    );
}
