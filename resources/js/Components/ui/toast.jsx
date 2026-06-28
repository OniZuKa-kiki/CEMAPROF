import * as React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
    <ToastPrimitives.Viewport
        ref={ref}
        className={cn(
            'toast-viewport fixed top-[calc(var(--site-header-offset,7rem)+0.75rem)] right-4 z-[10000] flex w-[min(100vw-2rem,400px)] flex-col gap-3 p-0 outline-none',
            className
        )}
        {...props}
    />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const Toast = React.forwardRef(({ className, ...props }, ref) => (
    <ToastPrimitives.Root
        ref={ref}
        className={cn(
            'toast-root group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden p-4 pr-11',
            'data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out',
            'data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full',
            'data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-right-full',
            className
        )}
        {...props}
    />
));
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
    <ToastPrimitives.Action
        ref={ref}
        className={cn(
            'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-surface focus:outline-none focus:ring-2 focus:ring-primary',
            className
        )}
        {...props}
    />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
    <ToastPrimitives.Close
        ref={ref}
        className={cn(
            'absolute right-2.5 top-2.5 rounded-lg p-1 text-foreground/40 transition-colors hover:bg-surface hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30',
            className
        )}
        toast-close=""
        {...props}
    >
        <X className="h-4 w-4" />
    </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
    <ToastPrimitives.Title ref={ref} className={cn('text-sm font-semibold leading-snug text-foreground', className)} {...props} />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
    <ToastPrimitives.Description
        ref={ref}
        className={cn('text-sm leading-relaxed text-muted-foreground', className)}
        {...props}
    />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

export { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose, ToastAction };
