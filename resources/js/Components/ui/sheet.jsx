import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetPortal = DialogPrimitive.Portal;

const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        className={cn(
            "sheet-overlay-smooth fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:duration-300 data-[state=closed]:duration-250",
            className,
        )}
        {...props}
        ref={ref}
    />
));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;

const SheetContent = React.forwardRef(
    ({ className, children, side = "right", ...props }, ref) => (
        <SheetPortal>
            <SheetOverlay />
            <DialogPrimitive.Content
                ref={ref}
                className={cn(
                    "sheet-content-smooth fixed z-[100] gap-4 bg-white p-6 shadow-xl transition ease-[cubic-bezier(0.32,0.72,0,1)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-[380ms]",
                    side === "right" &&
                        "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
                    side === "left" &&
                        "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
                    className,
                )}
                {...props}
            >
                {children}
                <SheetClose className="absolute right-4 top-4 rounded-full p-1 opacity-70 transition-opacity hover:bg-surface hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Fermer</span>
                </SheetClose>
            </DialogPrimitive.Content>
        </SheetPortal>
    ),
);
SheetContent.displayName = DialogPrimitive.Content.displayName;

const SheetHeader = ({ className, ...props }) => (
    <div
        className={cn(
            "flex flex-col space-y-2 text-center sm:text-left",
            className,
        )}
        {...props}
    />
);
SheetHeader.displayName = "SheetHeader";

const SheetTitle = React.forwardRef(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn("text-lg font-semibold text-foreground", className)}
        {...props}
    />
));
SheetTitle.displayName = DialogPrimitive.Title.displayName;

const SheetDescription = React.forwardRef(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
));
SheetDescription.displayName = DialogPrimitive.Description.displayName;

export {
    Sheet,
    SheetPortal,
    SheetOverlay,
    SheetTrigger,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
};
