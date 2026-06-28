import { Link } from '@inertiajs/react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Breadcrumb({ items = [] }) {
    return (
        <nav aria-label="Fil d'Ariane" className="flex flex-wrap items-center gap-1 text-sm text-white/80">
            <Link href="/" className="flex items-center transition-colors hover:text-white">
                <Home className="mr-1 h-4 w-4" />
                Accueil
            </Link>
            {items.map((item, index) => (
                <span key={index} className="flex items-center gap-1">
                    <ChevronRight className="h-4 w-4 text-white/50" />
                    {item.href ? (
                        <Link href={item.href} className="transition-colors hover:text-white">
                            {item.label}
                        </Link>
                    ) : (
                        <span className={cn(index === items.length - 1 && 'font-medium text-white')}>
                            {item.label}
                        </span>
                    )}
                </span>
            ))}
        </nav>
    );
}

export function PageHero({ title, subtitle, breadcrumb = [], eyebrow }) {
    return (
        <section className="page-hero page-hero--navy noise-overlay relative overflow-hidden text-white">
            <div className="absolute inset-0 bg-dot-grid-dark" />
            <div className="page-hero__diagonal" aria-hidden="true" />

            <div className="relative z-10 container-wide">
                {breadcrumb.length > 0 && (
                    <div className="mb-6 animate-fade-up">
                        <Breadcrumb items={breadcrumb} />
                    </div>
                )}
                {eyebrow && (
                    <span className="hero-label animate-fade-up mb-4 inline-flex">{eyebrow}</span>
                )}
                <h1 className="heading-fluid animate-fade-up delay-150 font-bold text-white">{title}</h1>
                {subtitle && (
                    <p className="body-lg animate-fade-up delay-300 mt-4 max-w-2xl text-white/70">{subtitle}</p>
                )}
            </div>
        </section>
    );
}

export function SectionTitle({ title, subtitle, centered = true, className }) {
    return (
        <div className={cn(centered ? 'mb-12 text-center' : 'mb-0', 'reveal-on-scroll', className)}>
            <h2 className={cn('text-3xl font-bold text-foreground sm:text-4xl', centered && 'section-accent mx-auto inline-block')}>
                {title}
            </h2>
            {!centered && <div className="section-accent mt-3" />}
            {subtitle && (
                <p className={cn('mt-6 text-muted-foreground', centered && 'mx-auto max-w-2xl')}>
                    {subtitle}
                </p>
            )}
        </div>
    );
}
