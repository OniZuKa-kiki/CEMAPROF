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
import { PageHero, SectionTitle } from '@/Components/PageHero';
import { Card, CardContent } from '@/Components/ui/card';

const activityIcons = [Wrench, Droplets, Factory, Shield, Package];

const values = [
    { icon: Target, title: 'Expertise métier', desc: 'Un catalogue orienté outillage, industrie, agriculture, tuyauterie, pompes et EPI.' },
    { icon: Handshake, title: 'Proximité', desc: 'Basés à Casablanca, disponibles pour vous conseiller par téléphone ou WhatsApp.' },
    { icon: Lightbulb, title: 'Stock & disponibilité', desc: 'Importation et distribution pour répondre rapidement aux demandes professionnelles.' },
    { icon: Eye, title: 'Transparence', desc: 'Devis clairs et accompagnement honnête à chaque étape de votre commande.' },
];

const sectors = [
    { icon: Factory, title: 'Industrie & ateliers', desc: 'Outillage, consommables et matériel pour la production et la maintenance.' },
    { icon: Tractor, title: 'Agriculture', desc: 'Matériel agricole, irrigation, pompes et accessoires pour exploitations.' },
    { icon: HardHat, title: 'BTP & chantiers', desc: 'EPI, quincaillerie, tuyauterie et matériel pour le bâtiment.' },
    { icon: Wrench, title: 'Artisans & PME', desc: 'Droguerie générale, fixations et outillage pour tous les corps de métier.' },
];

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

            <section className="section-py">
                <div className="container-wide">
                    <div className="grid items-center gap-12 lg:grid-cols-2">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-3xl font-bold text-foreground">Qui sommes-nous ?</h2>
                            <div className="mt-3 h-1 w-16 rounded-full bg-primary" />
                            <p className="mt-6 leading-relaxed text-muted-foreground">
                                {company?.description}
                            </p>
                            <p className="mt-4 leading-relaxed text-muted-foreground">
                                Basés à Casablanca, sur le boulevard des Forces Auxiliaires (Hay Moulay Rachid), nous accompagnons les professionnels, artisans, industriels et exploitants agricoles à travers le Maroc.
                            </p>
                            {mapsUrl && (
                                <Link
                                    href={mapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-6 inline-flex text-sm font-semibold text-primary hover:underline"
                                >
                                    Voir notre localisation sur Google Maps →
                                </Link>
                            )}
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="overflow-hidden rounded-2xl shadow-card-hover"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1581092918484-831393343c19?w=800&q=80"
                                alt="Matériel industriel CEMAPROF"
                                loading="lazy"
                                className="aspect-[4/3] w-full object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="section-py bg-surface">
                <div className="container-wide">
                    <SectionTitle title="Nos activités" subtitle="Les domaines que nous couvrons au quotidien" />
                    <div className="activity-showcase mx-auto max-w-5xl">
                        {activityLines.map((line, index) => {
                            const Icon = activityIcons[index % activityIcons.length];
                            return (
                                <motion.div
                                    key={line}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.06 }}
                                    className="activity-showcase__card"
                                >
                                    <div className="activity-showcase__icon">
                                        <Icon className="h-5 w-5" aria-hidden="true" />
                                    </div>
                                    <p className="activity-showcase__label">{line}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="section-py">
                <div className="container-wide">
                    <SectionTitle title="Nos valeurs" subtitle="Ce qui guide notre relation avec les clients" />
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {values.map((v, i) => (
                            <Card key={i} className="border-0 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                                <CardContent className="p-6">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                        <v.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-semibold text-foreground">{v.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section-py bg-surface">
                <div className="container-wide">
                    <SectionTitle title="Secteurs servis" subtitle="Des solutions pour chaque métier" />
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {sectors.map((s, i) => (
                            <Card key={i} className="border-0 text-center shadow-card">
                                <CardContent className="p-6">
                                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                        <s.icon className="h-7 w-7" />
                                    </div>
                                    <h3 className="font-semibold">{s.title}</h3>
                                    <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
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
