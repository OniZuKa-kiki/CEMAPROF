import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';

export function AdminFilterBar({ className, children }) {
    return (
        <div className={cn('admin-filter-bar', className)}>
            {children}
        </div>
    );
}

export function AdminFilterSearch({
    value,
    onChange,
    onSubmit,
    placeholder = 'Rechercher…',
    className,
}) {
    return (
        <div className={cn('admin-filter-bar__search', className)}>
            <Input
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onKeyDown={(e) => e.key === 'Enter' && onSubmit?.()}
                className="admin-filter-bar__search-input"
            />
            <Button type="button" variant="outline" size="sm" onClick={onSubmit}>
                Rechercher
            </Button>
        </div>
    );
}

export function AdminFilterControls({ children, className }) {
    return (
        <div className={cn('admin-filter-bar__controls', className)}>
            {children}
        </div>
    );
}

export function AdminFilterReset({ onClick, visible = true }) {
    if (!visible) {
        return null;
    }

    return (
        <div className="admin-filter-bar__reset">
            <Button type="button" variant="ghost" size="sm" onClick={onClick}>
                Réinitialiser
            </Button>
        </div>
    );
}
