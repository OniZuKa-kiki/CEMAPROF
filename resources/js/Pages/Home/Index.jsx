import { Head, Link } from '@inertiajs/react';
import { Award, Shield, Truck, Wrench, ArrowRight, ChevronRight } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import CategoryCard from '@/Components/CategoryCard';
import ProductCard from '@/Components/ProductCard';
import CounterSection from '@/Components/CounterSection';
import PageCta from '@/Components/PageCta';
import TestimonialsSection from '@/Components/TestimonialsSection';
import { SectionTitle } from '@/Components/PageHero';
import { Button } from '@/Components/ui/button';

const trustItems = [
    { icon: Shield, title: 'Qualité Garantie', desc: 'Produits certifiés et garantis' },
    { icon: Truck, title: 'Livraison Rapide', desc: 'Partout au Maroc' },
    { icon: Award, title: 'Prix Compétitifs', desc: 'Meilleurs tarifs du marché' },
    { icon: Wrench, title: 'SAV Professionnel', desc: 'Support technique dédié' },
];

export default function Home({ featuredProducts, categories, stats }) {
    const [featuredCat, ...otherCats] = categories || [];

    return (
        <MainLayout>
            <Head title="Accueil — Matériel Professionnel au Maroc">
                <meta head-key="description" name="description" content="CEMAPROF — La Centrale du Matériel Professionnel. Équipement pro, droguerie, cuisine professionnelle, outillage et mobilier au Maroc." />
                <meta head-key="og:title" property="og:title" content="CEMAPROF — Le Matériel Professionnel au Meilleur Prix" />
                <meta head-key="og:description" property="og:description" content="Votre partenaire de confiance pour l'équipement professionnel au Maroc." />
                <meta head-key="og:image" property="og:image" content="/images/logo.png" />
            </Head>

            <section className="hero-split noise-overlay relative min-h-screen overflow-hidden">
                <div className="absolute inset-0 bg-dot-grid-dark" />
                <div className="hero-mobile-visual lg:hidden" aria-hidden="true">
                    <img
                        src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900&q=80"
                        alt=""
                        className="hero-mobile-visual__img"
                    />
                    <div className="hero-mobile-visual__overlay" />
                </div>

                <div className="hero-split__text relative z-10 flex flex-col justify-center">
                    <div className="hero-label animate-fade-up">
                        La Centrale du Matériel Professionnel
                    </div>

                    <h1 className="hero-title animate-fade-up delay-150 text-white mt-5">
                        L&apos;équipement pro
                        <span className="block">
                            au meilleur{' '}
                            <span className="gradient-text-red">prix.</span>
                        </span>
                    </h1>

                    <p className="body-lg animate-fade-up delay-300 text-white/70 mt-6 max-w-md">
                        Matériel de cuisine, outillage, mobilier et droguerie — tout ce dont votre entreprise a besoin, livré partout au Maroc.
                    </p>

                    <div className="animate-fade-up delay-500 mt-10 flex flex-wrap gap-4 items-center">
                        <Button variant="white" size="lg" asChild>
                            <Link href="/produits">
                                Voir nos produits
                                <ArrowRight className="h-4 w-4 ml-1.5" />
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            size="lg"
                            asChild
                            className="border border-white/25 text-white hover:bg-white/10 hover:text-white"
                        >
                            <Link href="/contact?subject=devis">Demander un devis</Link>
                        </Button>
                    </div>

                    <div className="animate-fade-up delay-700 hero-trust-grid mt-10 border-t border-white/12 pt-6 sm:mt-14 sm:pt-8">
                        {trustItems.map((item, i) => (
                            <div key={i} className="flex items-center gap-2.5">
                                <div className="mini-trust-icon">
                                    <item.icon className="h-3.5 w-3.5" />
                                </div>
                                <span className="text-white/65 text-xs font-medium leading-tight">{item.title}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hero-split__mosaic animate-fade-in delay-300 relative z-10 hidden lg:flex items-center justify-center">
                    <div className="mosaic-grid">
                        <div className="mosaic-cell mosaic-cell--tall">
                            <img
                                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=700&q=85"
                                alt="Équipement professionnel"
                                className="mosaic-img"
                                loading="eager"
                            />
                            <div className="mosaic-badge">
                                <Shield className="h-3.5 w-3.5" />
                                Qualité certifiée
                            </div>
                        </div>
                        <div className="mosaic-col-right">
                            <div className="mosaic-cell mosaic-cell--square">
                                <img
                                    src="https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=500&q=85"
                                    alt="Cuisine professionnelle"
                                    className="mosaic-img"
                                    loading="eager"
                                />
                            </div>
                            <div className="mosaic-cell mosaic-cell--square">
                                <img
                                    src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=500&q=85"
                                    alt="Outillage"
                                    className="mosaic-img"
                                    loading="eager"
                                />
                                <div className="mosaic-badge mosaic-badge--red">
                                    <Truck className="h-3.5 w-3.5" />
                                    Livraison Maroc
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mosaic-stat-card animate-float">
                        <p className="mosaic-stat-number">+2 000</p>
                        <p className="mosaic-stat-label">produits en stock</p>
                    </div>
                </div>

                <div className="hero-diagonal" />
            </section>

            <section className="section-py">
                <div className="container-wide">
                    <div className="flex items-end justify-between mb-10">
                        <SectionTitle
                            title="Nos Catégories"
                            subtitle="Large gamme de matériel professionnel"
                            centered={false}
                            className="mb-0"
                        />
                        <Link
                            href="/produits"
                            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors shrink-0 mb-2"
                        >
                            Tout voir <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="editorial-categories hidden sm:grid">
                        {featuredCat && (
                            <div className="editorial-cat--featured">
                                <CategoryCard category={featuredCat} featured />
                            </div>
                        )}
                        <div className="editorial-cat--grid">
                            {otherCats.slice(0, 4).map((cat) => (
                                <CategoryCard key={cat.id} category={cat} />
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 overflow-x-auto snap-x-mandatory pb-3 sm:hidden scroll-hide -mx-4 px-4">
                        {categories.map((cat) => (
                            <div key={cat.id} className="snap-start shrink-0 w-36">
                                <CategoryCard category={cat} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section-py bg-surface">
                <div className="container-wide">
                    <div className="flex items-end justify-between mb-10">
                        <SectionTitle
                            title="Produits Phares"
                            subtitle="Nos meilleures références du moment"
                            centered={false}
                            className="mb-0"
                        />
                        <Link
                            href="/produits"
                            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors shrink-0 mb-2"
                        >
                            Catalogue complet <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    <div className="mt-10 text-center sm:hidden">
                        <Button size="lg" asChild>
                            <Link href="/produits">Voir tous les produits</Link>
                        </Button>
                    </div>
                </div>
            </section>

            <CounterSection stats={stats} />
            <TestimonialsSection />

            <PageCta />
        </MainLayout>
    );
}
