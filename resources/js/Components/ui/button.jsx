import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg",
                accent: "bg-accent text-white hover:bg-accent-dark shadow-md hover:shadow-lg",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-accent-dark",
                outline:
                    "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-white",
                secondary: "bg-surface text-foreground hover:bg-gray-200",
                ghost: "hover:bg-surface hover:text-primary",
                link: "text-primary underline-offset-4 hover:underline",
                white: "bg-white text-primary hover:bg-gray-100 shadow-md",
            },
            size: {
                default: "h-11 px-6 py-2",
                sm: "h-9 rounded-full px-4 text-xs",
                lg: "h-12 rounded-full px-8 text-base",
                icon: "h-10 w-10 rounded-full",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

const Button = React.forwardRef(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    },
);
Button.displayName = "Button";

export { Button, buttonVariants };
