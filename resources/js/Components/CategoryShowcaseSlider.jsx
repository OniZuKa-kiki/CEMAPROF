import { useCallback, useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { getCategoryVisual, getCategoryVisualModifier } from '@/lib/categoryVisuals';
import { cn } from '@/lib/utils';

const imageTransition = {
    opacity: { duration: 0.45, ease: [0.32, 0.72, 0, 1] },
    scale: { duration: 0.6, ease: [0.32, 0.72, 0, 1] },
};

const contentTransition = {
    duration: 0.4,
    ease: [0.32, 0.72, 0, 1],
};

export default function CategoryShowcaseSlider({ categories = [] }) {
    const validCategories = categories.filter((item) => item?.id && item?.name && item?.slug);
    const [activeIndex, setActiveIndex] = useState(0);
    const count = validCategories.length;

    const goTo = useCallback((index) => {
        if (!count) {
            return;
        }
        setActiveIndex(((index % count) + count) % count);
    }, [count]);

    const goPrev = useCallback(() => {
        setActiveIndex((current) => (current - 1 + count) % count);
    }, [count]);

    const goNext = useCallback(() => {
        setActiveIndex((current) => (current + 1) % count);
    }, [count]);

    useEffect(() => {
        if (count <= 1) {
            return undefined;
        }

        const timer = window.setInterval(() => {
            setActiveIndex((current) => (current + 1) % count);
        }, 7000);

        return () => window.clearInterval(timer);
    }, [count]);

    if (!count) {
        return null;
    }

    const category = validCategories[activeIndex];

    return (
        <section className="category-showcase section-py">
            <div className="container-wide">
                <div className="category-showcase__header">
                    <div>
                        <p className="category-showcase__eyebrow">
                            <span className="category-showcase__dot" aria-hidden="true" />
                            Nos catégories
                        </p>
                        <h2 className="category-showcase__title">Explorez notre univers produits</h2>
                        <p className="category-showcase__subtitle">
                            Outillage, tuyauterie, pompes, EPI, quincaillerie — tout pour l&apos;industrie et l&apos;agricole
                        </p>
                    </div>
                    <Link href="/produits" className="category-showcase__link hidden sm:inline-flex">
                        Tout voir <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="category-showcase__stage">
                    <button
                        type="button"
                        className="category-showcase__arrow category-showcase__arrow--prev"
                        onClick={goPrev}
                        aria-label="Catégorie précédente"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>

                    <div className="category-showcase__panel">
                        <div className="category-showcase__slide">
                            <motion.div
                                key={`visual-${category.id}`}
                                className={cn(
                                    'category-showcase__visual-wrap',
                                    getCategoryVisualModifier(category),
                                )}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={imageTransition}
                            >
                                <img
                                    src={getCategoryVisual(category)}
                                    alt={category.name}
                                    className="category-showcase__visual"
                                    loading="lazy"
                                />
                            </motion.div>

                            <motion.div
                                key={`content-${category.id}`}
                                className="category-showcase__content"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={contentTransition}
                            >
                                <h3 className="category-showcase__name">{category.name}</h3>
                                <p className="category-showcase__desc">{category.description}</p>
                                {category.products_count != null && (
                                    <p className="category-showcase__count">
                                        {category.products_count} produit{category.products_count > 1 ? 's' : ''}
                                    </p>
                                )}
                                <Button size="lg" className="category-showcase__cta" asChild>
                                    <Link href={`/categories/${category.slug}`}>
                                        Explorer la catégorie
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </motion.div>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="category-showcase__arrow category-showcase__arrow--next"
                        onClick={goNext}
                        aria-label="Catégorie suivante"
                    >
                        <ArrowRight className="h-5 w-5" />
                    </button>
                </div>

                <div className="category-showcase__indicators" role="tablist" aria-label="Catégories">
                    {validCategories.map((item, index) => (
                        <button
                            key={item.id}
                            type="button"
                            role="tab"
                            aria-selected={index === activeIndex}
                            aria-label={item.name}
                            className={cn(
                                'category-showcase__indicator',
                                index === activeIndex && 'category-showcase__indicator--active',
                            )}
                            onClick={() => goTo(index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
