import LightSelect from '@/Components/LightSelect';
import { cn } from '@/lib/utils';

export default function FormSelect({
    value,
    onValueChange,
    options = [],
    placeholder = 'Choisir…',
    id,
    className,
    triggerClassName,
    ariaLabel,
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
            triggerClassName={cn('ui-select-trigger', triggerClassName, className)}
            contentClassName="form-select-content"
            itemClassName="ui-select-item"
        />
    );
}
