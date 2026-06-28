import { cn } from "@/lib/utils";

export function NativeSelect({ className, value, children, ...props }) {
    const safeValue =
        value === undefined || value === null ? "" : String(value);

    return (
        <select
            className={cn(
                "native-select flex h-11 w-full appearance-none rounded-xl border border-input bg-white bg-[length:16px] bg-[position:right_12px_center] bg-no-repeat px-4 py-2 text-sm text-foreground ring-offset-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
                className,
            )}
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
            }}
            value={safeValue}
            {...props}
        >
            {children}
        </select>
    );
}
