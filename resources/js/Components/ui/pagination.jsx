import * as React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';

function isPageNumber(label) {
    const text = label.replace(/<[^>]*>/g, '').trim();
    return /^\d+$/.test(text);
}

export function Pagination({ links, className }) {
    if (!links || links.length <= 3) return null;

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
                            asChild={!!link.url}
                            className="rounded-full"
                            aria-label="Page précédente"
                        >
                            {link.url ? (
                                <Link href={link.url} preserveState preserveScroll>
                                    <ChevronLeft className="h-4 w-4" />
                                </Link>
                            ) : (
                                <span><ChevronLeft className="h-4 w-4" /></span>
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
                            asChild={!!link.url}
                            className="rounded-full"
                            aria-label="Page suivante"
                        >
                            {link.url ? (
                                <Link href={link.url} preserveState preserveScroll>
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            ) : (
                                <span><ChevronRight className="h-4 w-4" /></span>
                            )}
                        </Button>
                    );
                }

                if (!isPageNumber(link.label)) {
                    return null;
                }

                return (
                    <Button
                        key={index}
                        variant={link.active ? 'default' : 'ghost'}
                        size="sm"
                        disabled={!link.url}
                        asChild={!!link.url}
                        className={cn('min-w-[40px] rounded-full', link.active && 'pointer-events-none')}
                    >
                        {link.url ? (
                            <Link href={link.url} preserveState preserveScroll>
                                {link.label.replace(/<[^>]*>/g, '')}
                            </Link>
                        ) : (
                            <span>{link.label.replace(/<[^>]*>/g, '')}</span>
                        )}
                    </Button>
                );
            })}
        </nav>
    );
}
