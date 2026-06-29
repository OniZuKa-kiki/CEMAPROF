import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Shield, Wrench, ArrowRight, Factory, Droplets, Truck } from 'lucide-react';
import { Button } from '@/Components/ui/button';

const trustItems = [
    { icon: Factory, title: 'Import & Stock' },
    { icon: Shield, title: 'Marques reconnues' },
    { icon: Truck, title: 'Livraison Maroc' },
    { icon: Wrench, title: 'Conseil pro' },
];

const HERO_IMAGE = '/images/hero/worker.png';
const HERO_IMAGE_FALLBACK = 'https://images.unsplash.com/photo-1621905251189-08b45d6a2699?w=960&q=85&auto=format&fit=crop';

const ease = [0.32, 0.72, 0, 1];

export default function HomeHero() {
    const { company } = usePage().props;
    const [heroSrc, setHeroSrc] = useState(HERO_IMAGE);

    const textContainer = {
        hidden: {},
        show: {
            transition: { staggerChildren: 0.11, delayChildren: 0.08 },
        },
    };

    const textItem = {
        hidden: { opacity: 0, y: 32, filter: 'blur(10px)' },
        show: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: { duration: 0.75, ease },
        },
    };

    const visualInitial = { opacity: 0, x: 72, scale: 0.94 };
    const visualAnimate = { opacity: 1, x: 0, scale: 1 };

    return (
        <section className="hero-split noise-overlay relative min-h-screen overflow-hidden">
            <div className="absolute inset-0 bg-dot-grid-dark" />

            <div className="hero-mobile-visual lg:hidden" aria-hidden="true">
                <img
                    src={heroSrc === HERO_IMAGE ? HERO_IMAGE_FALLBACK : heroSrc}
                    alt=""
                    className="hero-mobile-visual__img"
                />
                <div className="hero-mobile-visual__overlay" />
            </div>

            <motion.div
                className="hero-split__text relative z-10 flex flex-col justify-center"
                variants={textContainer}
                initial="hidden"
                animate="show"
            >
                <motion.div className="hero-label" variants={textItem}>
                    {company?.tagline ?? 'Importateur · Distributeur'}
                </motion.div>

                <motion.h1 className="hero-title text-white mt-5" variants={textItem}>
                    Outillage & matériel
                    <span className="block">
                        industriel{' '}
                        <span className="gradient-text-red">au Maroc.</span>
                    </span>
                </motion.h1>

                <motion.p className="body-lg text-white/70 mt-6 max-w-lg" variants={textItem}>
                    {company?.short_description ?? company?.description}
                </motion.p>

                <motion.div className="mt-10 flex flex-wrap gap-4 items-center" variants={textItem}>
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
                </motion.div>

                <motion.div className="hero-trust-grid mt-10 border-t border-white/12 pt-6 sm:mt-14 sm:pt-8" variants={textItem}>
                    {trustItems.map((item, i) => (
                        <div key={i} className="flex items-center gap-2.5">
                            <div className="mini-trust-icon">
                                <item.icon className="h-3.5 w-3.5" />
                            </div>
                            <span className="text-white/65 text-xs font-medium leading-tight">{item.title}</span>
                        </div>
                    ))}
                </motion.div>
            </motion.div>

            <div className="hero-split__visual relative z-10 hidden lg:flex items-center justify-center">
                <div className="hero-visual__glow" aria-hidden="true" />

                <motion.div
                    className="hero-visual__wrap"
                    initial={visualInitial}
                    animate={visualAnimate}
                    transition={{ duration: 0.95, delay: 0.28, ease }}
                >
                    <div className="hero-visual__frame">
                        <img
                            src={heroSrc}
                            alt="Technicien professionnel avec outillage industriel"
                            className="hero-visual__img"
                            loading="eager"
                            decoding="async"
                            onError={() => setHeroSrc(HERO_IMAGE_FALLBACK)}
                        />
                        <div className="hero-visual__shine" aria-hidden="true" />
                    </div>

                    <motion.div
                        className="hero-visual__badge"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.85, ease }}
                    >
                        <Shield className="h-3.5 w-3.5" />
                        Stock permanent
                    </motion.div>

                    <motion.div
                        className="hero-visual__badge hero-visual__badge--red"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 1, ease }}
                    >
                        <Droplets className="h-3.5 w-3.5" />
                        Pompes & tuyauterie
                    </motion.div>
                </motion.div>

                <motion.div
                    className="hero-visual__stat"
                    initial={{ opacity: 0, y: 24, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.05, ease }}
                >
                    <p className="hero-visual__stat-number">+2 000</p>
                    <p className="hero-visual__stat-label">références disponibles</p>
                </motion.div>
            </div>

            <div className="hero-diagonal" />
        </section>
    );
}
