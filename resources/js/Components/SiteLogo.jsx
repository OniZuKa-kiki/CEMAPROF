import { cn } from '@/lib/utils';
import { LOGO_ALT, LOGO_PATH } from '@/lib/siteAssets';

export { LOGO_ALT, LOGO_PATH };

const sizes = {
    sm: 'h-12 sm:h-14',
    md: 'h-14 sm:h-16',
    lg: 'h-20 sm:h-24',
};

const maxWidths = {
    sm: 'max-w-[180px]',
    md: 'max-w-[220px]',
    lg: 'max-w-[280px]',
};

export default function SiteLogo({ className, size = 'md' }) {
    return (
        <img
            src={LOGO_PATH}
            alt={LOGO_ALT}
            className={cn('w-auto object-contain', maxWidths[size] ?? maxWidths.md, sizes[size] ?? sizes.md, className)}
            width={280}
            height={100}
            decoding="async"
        />
    );
}
