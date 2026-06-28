import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import {
    ToastProvider as RadixToastProvider,
    ToastViewport,
    Toast,
    ToastTitle,
    ToastDescription,
    ToastClose,
} from '@/Components/ui/toast';
import { useToast } from '@/Components/ui/use-toast';
import { cn } from '@/lib/utils';

const variantConfig = {
    success: {
        className: 'toast--success border-emerald-200',
        icon: CheckCircle2,
        iconClass: 'bg-emerald-50 text-emerald-600',
        progressClass: 'bg-emerald-500',
    },
    destructive: {
        className: 'toast--destructive border-red-200',
        icon: AlertCircle,
        iconClass: 'bg-red-50 text-red-600',
        progressClass: 'bg-red-500',
    },
    default: {
        className: 'toast--default border-primary/20',
        icon: Info,
        iconClass: 'bg-primary/10 text-primary',
        progressClass: 'bg-primary',
    },
};

export function Toaster() {
    const { toasts } = useToast();

    return (
        <RadixToastProvider swipeDirection="right" duration={5000}>
            {toasts.map(({ id, title, description, variant = 'default', open }) => {
                const config = variantConfig[variant] || variantConfig.default;
                const Icon = config.icon;

                return (
                    <Toast
                        key={id}
                        open={open}
                        className={cn(config.className)}
                    >
                        <span className={cn('toast-icon', config.iconClass)} aria-hidden="true">
                            <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1 pt-0.5">
                            {title && <ToastTitle>{title}</ToastTitle>}
                            {description && <ToastDescription>{description}</ToastDescription>}
                        </div>
                        <ToastClose />
                        <span className={cn('toast-progress', config.progressClass)} aria-hidden="true" />
                    </Toast>
                );
            })}
            <ToastViewport />
        </RadixToastProvider>
    );
}
