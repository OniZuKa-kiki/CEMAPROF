import { useCallback, useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/Components/ui/carousel';
import ProductCard from '@/Components/ProductCard';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';

export default function FeaturedProductsSlider({ products = [] }) {
    const [api, setApi] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [snapCount, setSnapCount] = useState(0);

    const onSelect = useCallback(() => {
        if (!api) {
            return;
        }
        setActiveIndex(api.selectedScrollSnap());
        setSnapCount(api.scrollSnapList().length);
    }, [api]);

    useEffect(() => {
        if (!api) {
            return undefined;
        }
        onSelect();
        api.on('select', onSelect);
        api.on('reInit', onSelect);
        return () => {
            api.off('select', onSelect);
            api.off('reInit', onSelect);
        };
    }, [api, onSelect]);

    if (!products.length) {
        return null;
    }

    return (
        <section className="featured-showcase section-py">
            <div className="container-wide">
                <div className="featured-showcase__header">
                    <div>
                        <p className="featured-showcase__eyebrow">
                            <span className="featured-showcase__dot" aria-hidden="true" />
                            Produits phares
                        </p>
                        <h2 className="featured-showcase__title">
                            <span className="featured-showcase__title-accent">Populaires</span>
                            {' '}du moment
                        </h2>
                    </div>
                    <Button variant="outline" className="featured-showcase__catalog hidden sm:inline-flex" asChild>
                        <Link href="/produits">
                            Catalogue complet
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                <div className="featured-showcase__stage">
                    <button
                        type="button"
                        className="featured-showcase__arrow"
                        onClick={() => api?.scrollPrev()}
                        aria-label="Produits précédents"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>

                    <Carousel
                        setApi={setApi}
                        opts={{ align: 'start', loop: products.length > 4 }}
                        className="featured-showcase__carousel"
                    >
                        <CarouselContent className="-ml-4">
                            {products.map((product) => (
                                <CarouselItem
                                    key={product.id}
                                    className="basis-full pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                                >
                                    <ProductCard product={product} className="h-full" />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>

                    <button
                        type="button"
                        className="featured-showcase__arrow"
                        onClick={() => api?.scrollNext()}
                        aria-label="Produits suivants"
                    >
                        <ArrowRight className="h-5 w-5" />
                    </button>
                </div>

                {snapCount > 1 && (
                    <div className="featured-showcase__indicators" role="tablist" aria-label="Pages produits">
                        {Array.from({ length: snapCount }).map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                role="tab"
                                aria-selected={index === activeIndex}
                                className={cn(
                                    'featured-showcase__indicator',
                                    index === activeIndex && 'featured-showcase__indicator--active',
                                )}
                                onClick={() => api?.scrollTo(index)}
                            />
                        ))}
                    </div>
                )}

                <div className="mt-8 text-center sm:hidden">
                    <Button size="lg" asChild>
                        <Link href="/produits">Voir tous les produits</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
