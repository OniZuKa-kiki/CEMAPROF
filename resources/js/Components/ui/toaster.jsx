import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
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
        className: 'toast--success',
        icon: CheckCircle2,
        iconClass: 'toast-icon--success',
        glowClass: 'toast-glow--success',
    },
    destructive: {
        className: 'toast--destructive',
        icon: AlertCircle,
        iconClass: 'toast-icon--destructive',
        glowClass: 'toast-glow--destructive',
    },
    default: {
        className: 'toast--default',
        icon: Sparkles,
        iconClass: 'toast-icon--default',
        glowClass: 'toast-glow--default',
    },
};

export function Toaster() {
    const { toasts } = useToast();

    return (
        <RadixToastProvider swipeDirection="right" duration={4500}>
            {toasts.map(({ id, title, description, variant = 'default', open }) => {
                const config = variantConfig[variant] || variantConfig.default;
                const Icon = config.icon;

                return (
                    <Toast
                        key={id}
                        open={open}
                        className={cn('toast-shell', config.className)}
                    >
                        <span className={cn('toast-glow', config.glowClass)} aria-hidden="true" />
                        <span className={cn('toast-icon', config.iconClass)} aria-hidden="true">
                            <Icon className="h-5 w-5" />
                        </span>
                        <div className="toast-body">
                            {title && <ToastTitle>{title}</ToastTitle>}
                            {description && <ToastDescription>{description}</ToastDescription>}
                        </div>
                        <ToastClose />
                        <span className="toast-timer" aria-hidden="true" />
                    </Toast>
                );
            })}
            <ToastViewport />
        </RadixToastProvider>
    );
}
