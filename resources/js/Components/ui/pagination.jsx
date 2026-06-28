import * as React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';

function isPageNumber(label) {
    const text = label.replace(/<[^>]*>/g, '').trim();
    return /^\d+$/.test(text);
}

export function Pagination({ links, className, onNavigate, visitOptions }) {
    if (!links || links.length <= 3) return null;

    const handleNavigate = (url) => {
        if (!url || !onNavigate) {
            return;
        }
        onNavigate(url, visitOptions);
    };

    return (
        <nav className={cn('flex items-center justify-center gap-1', className)} aria-label="Pagination">
            {links.map((link, index) => {
                const isFirst = index === 0;
                const isLast = index === links.length - 1;

                if (isFirst) {
                    return (
                        <Button
                            key={index}
                            variant="outline"
                            size="icon"
                            disabled={!link.url}
                            className="rounded-full"
                            aria-label="Page précédente"
                            onClick={link.url && onNavigate ? () => handleNavigate(link.url) : undefined}
                            asChild={!!link.url && !onNavigate}
                        >
                            {link.url && !onNavigate ? (
                                <Link href={link.url} preserveState>
                                    <ChevronLeft className="h-4 w-4" />
                                </Link>
                            ) : (
                                <ChevronLeft className="h-4 w-4" />
                            )}
                        </Button>
                    );
                }

                if (isLast) {
                    return (
                        <Button
                            key={index}
                            variant="outline"
                            size="icon"
                            disabled={!link.url}
                            className="rounded-full"
                            aria-label="Page suivante"
                            onClick={link.url && onNavigate ? () => handleNavigate(link.url) : undefined}
                            asChild={!!link.url && !onNavigate}
                        >
                            {link.url && !onNavigate ? (
                                <Link href={link.url} preserveState>
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            )}
                        </Button>
                    );
                }

                if (!isPageNumber(link.label)) {
                    return null;
                }

                const label = link.label.replace(/<[^>]*>/g, '');

                return (
                    <Button
                        key={index}
                        variant={link.active ? 'default' : 'ghost'}
                        size="sm"
                        disabled={!link.url}
                        className={cn('min-w-[40px] rounded-full', link.active && 'pointer-events-none')}
                        onClick={link.url && onNavigate ? () => handleNavigate(link.url) : undefined}
                        asChild={!!link.url && !onNavigate}
                    >
                        {link.url && !onNavigate ? (
                            <Link href={link.url} preserveState>
                                {label}
                            </Link>
                        ) : (
                            <span>{label}</span>
                        )}
                    </Button>
                );
            })}
        </nav>
    );
}
