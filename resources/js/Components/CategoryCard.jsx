import { Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CategoryCard({ category, className, featured = false }) {
    return (
        <Link
            href={`/categories/${category.slug}`}
            className={cn('category-card group relative block overflow-hidden', featured && 'h-full min-h-[340px]', className)}
        >
            <img
                src={category.image_url || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80'}
                alt={category.name}
                loading="lazy"
                className={cn('w-full object-cover', featured ? 'absolute inset-0 h-full' : 'h-40 sm:h-44')}
            />
            <div className="overlay" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between p-4">
                <div>
                    <h3 className="text-base font-semibold text-white sm:text-lg">{category.name}</h3>
                    {category.products_count !== undefined && (
                        <p className="text-xs text-white/80">{category.products_count} produits</p>
                    )}
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    <ArrowUpRight className="h-4 w-4" />
                </div>
            </div>
        </Link>
    );
}
