import { cn } from '@/lib/utils';

const sizes = {
    sm: 'h-10',
    md: 'h-12 sm:h-14',
    lg: 'h-16 sm:h-20',
};

export default function SiteLogo({ className, size = 'md' }) {
    return (
        <img
            src="/images/logo.png"
            alt="CEMAPROF — La Centrale du Matériel Professionnel"
            className={cn('w-auto max-w-[220px] object-contain', sizes[size] ?? sizes.md, className)}
            width={220}
            height={80}
            decoding="async"
        />
    );
}
