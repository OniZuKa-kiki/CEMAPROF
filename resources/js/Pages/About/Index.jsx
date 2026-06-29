import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Eye,
    Handshake,
    Lightbulb,
    Target,
    Factory,
    Tractor,
    HardHat,
    Wrench,
    Droplets,
    Shield,
    Package,
} from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import CounterSection from '@/Components/CounterSection';
import PageCta from '@/Components/PageCta';
import CursorParallaxImage from '@/Components/CursorParallaxImage';
import ActivitiesShowcase from '@/Components/ActivitiesShowcase';
import { PageHero, SectionTitle } from '@/Components/PageHero';

const activityIcons = [Wrench, Droplets, Factory, Shield, Package];

const values = [
    { icon: Target, title: 'Expertise métier', desc: 'Un catalogue orienté outillage, industrie, agriculture, tuyauterie, pompes et EPI.' },
    { icon: Handshake, title: 'Proximité', desc: 'Basés à Casablanca, disponibles pour vous conseiller par téléphone ou WhatsApp.' },
    { icon: Lightbulb, title: 'Stock & disponibilité', desc: 'Importation et distribution pour répondre rapidement aux demandes professionnelles.' },
    { icon: Eye, title: 'Transparence', desc: 'Devis clairs et accompagnement honnête à chaque étape de votre commande.' },
];

const sectors = [
    { icon: Factory, title: 'Industrie & ateliers', desc: 'Outillage, consommables et matériel pour la production et la maintenance.', accent: 'blue' },
    { icon: Tractor, title: 'Agriculture', desc: 'Matériel agricole, irrigation, pompes et accessoires pour exploitations.', accent: 'green' },
    { icon: HardHat, title: 'BTP & chantiers', desc: 'EPI, quincaillerie, tuyauterie et matériel pour le bâtiment.', accent: 'red' },
    { icon: Wrench, title: 'Artisans & PME', desc: 'Droguerie générale, fixations et outillage pour tous les corps de métier.', accent: 'navy' },
];

const ABOUT_IMAGE = '/images/about/workshop.jpg';
const ABOUT_IMAGE_FALLBACK = 'https://images.unsplash.com/photo-1581092918484-831393343c19?w=900&q=85';

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: 0.5 },
};

export default function AboutIndex({ stats }) {
    const { company, siteSettings } = usePage().props;
    const mapsUrl = siteSettings?.google_maps_url || company?.maps_url;
    const activityLines = company?.activity_lines ?? [];

    return (
        <MainLayout>
            <Head title="À Propos — CEMAPROF">
                <meta head-key="description" name="description" content={company?.description ?? 'CEMAPROF, importateur distributeur à Casablanca : outillage, matériel industriel et agricole, tuyauterie, pompes, EPI, quincaillerie.'} />
            </Head>

            <PageHero
                title="À Propos de CEMAPROF"
                subtitle={company?.tagline ?? 'Importateur · Distributeur'}
                eyebrow="Notre entreprise"
                breadcrumb={[{ label: 'À propos' }]}
            />

            <section className="about-intro section-py">
                <div className="container-wide">
                    <div className="about-intro__grid">
                        <motion.div {...fadeUp}>
                            <p className="about-eyebrow">Qui sommes-nous</p>
                            <h2 className="about-intro__title">Votre partenaire matériel pro à Casablanca</h2>
                            <p className="about-intro__text">{company?.description}</p>
                            <p className="about-intro__text">
                                Basés sur le boulevard des Forces Auxiliaires (Hay Moulay Rachid), nous accompagnons les professionnels, artisans, industriels et exploitants agricoles à travers le Maroc.
                            </p>
                            {mapsUrl && (
                                <Link
                                    href={mapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="about-intro__link"
                                >
                                    Voir notre localisation sur Google Maps →
                                </Link>
                            )}
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.65, delay: 0.1 }}
                        >
                            <CursorParallaxImage
                                src={ABOUT_IMAGE}
                                fallbackSrc={ABOUT_IMAGE_FALLBACK}
                                alt="Atelier industriel CEMAPROF"
                                className="about-intro__visual rounded-2xl shadow-card-hover"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="section-py bg-surface overflow-hidden">
                <div className="container-wide">
                    <SectionTitle title="Nos activités" subtitle="Les domaines que nous couvrons au quotidien" />
                    <ActivitiesShowcase lines={activityLines} icons={activityIcons} />
                </div>
            </section>

            <section className="about-dna section-py">
                <div className="container-wide">
                    <motion.div className="about-dna__header" {...fadeUp}>
                        <p className="about-eyebrow">Nos engagements</p>
                        <h2 className="about-dna__title">Ce qui nous définit &amp; qui nous servons</h2>
                        <p className="about-dna__subtitle">
                            Nos valeurs au quotidien et les secteurs que nous accompagnons — clair, concret, sans jargon.
                        </p>
                    </motion.div>

                    <div className="about-dna__bento">
                        <motion.div className="about-values" {...fadeUp} transition={{ duration: 0.5, delay: 0.05 }}>
                            <h3 className="about-values__title">Nos valeurs</h3>
                            <ol className="about-values__list">
                                {values.map((value, index) => (
                                    <motion.li
                                        key={value.title}
                                        className="about-values__item"
                                        initial={{ opacity: 0, x: -16 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: index * 0.08 }}
                                    >
                                        <span className="about-values__step">{String(index + 1).padStart(2, '0')}</span>
                                        <div className="about-values__icon">
                                            <value.icon className="h-5 w-5" aria-hidden="true" />
                                        </div>
                                        <div>
                                            <h4 className="about-values__label">{value.title}</h4>
                                            <p className="about-values__desc">{value.desc}</p>
                                        </div>
                                    </motion.li>
                                ))}
                            </ol>
                        </motion.div>

                        <div className="about-sectors">
                            {sectors.map((sector, index) => (
                                <motion.article
                                    key={sector.title}
                                    className={`about-sector about-sector--${sector.accent}`}
                                    initial={{ opacity: 0, y: 28 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.45, delay: index * 0.07 }}
                                    whileHover={{ y: -4 }}
                                >
                                    <div className="about-sector__icon">
                                        <sector.icon className="h-6 w-6" aria-hidden="true" />
                                    </div>
                                    <h3 className="about-sector__title">{sector.title}</h3>
                                    <p className="about-sector__desc">{sector.desc}</p>
                                </motion.article>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <CounterSection stats={stats} />

            <PageCta
                eyebrow="Un projet ?"
                title="Besoin d'un devis ou d'un conseil ?"
                description="Contactez-nous par formulaire ou WhatsApp — réponse rapide."
            />
        </MainLayout>
    );
}
