import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Eye, Handshake, Lightbulb, Target } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import CounterSection from '@/Components/CounterSection';
import PageCta from '@/Components/PageCta';
import { PageHero, SectionTitle } from '@/Components/PageHero';
import { Card, CardContent } from '@/Components/ui/card';

const values = [
    { icon: Target, title: 'Excellence', desc: 'Des produits de qualité supérieure sélectionnés auprès des meilleures marques internationales.' },
    { icon: Handshake, title: 'Confiance', desc: 'Plus de 10 ans de relation durable avec nos clients professionnels à travers tout le Maroc.' },
    { icon: Lightbulb, title: 'Innovation', desc: 'Une veille constante sur les nouveautés du marché pour vous proposer les dernières solutions.' },
    { icon: Eye, title: 'Transparence', desc: 'Des devis clairs, des prix compétitifs et un accompagnement honnête à chaque étape.' },
];

const team = [
    { name: 'Mohamed Alami', role: 'Directeur Général', initials: 'MA', color: 'bg-primary' },
    { name: 'Sara Bennani', role: 'Responsable Commerciale', initials: 'SB', color: 'bg-accent' },
    { name: 'Youssef Idrissi', role: 'Responsable Technique SAV', initials: 'YI', color: 'bg-emerald-600' },
];

export default function AboutIndex({ stats }) {
    return (
        <MainLayout>
            <Head title="À Propos — CEMAPROF">
                <meta head-key="description" name="description" content="Découvrez l'histoire de CEMAPROF, La Centrale du Matériel Professionnel au Maroc. Notre mission, nos valeurs et notre équipe." />
            </Head>

            <PageHero
                title="À Propos de CEMAPROF"
                subtitle="La Centrale du Matériel Professionnel depuis plus de 10 ans"
                eyebrow="Notre entreprise"
                breadcrumb={[{ label: 'À propos' }]}
            />

            {/* History */}
            <section className="section-py">
                <div className="container-wide">
                    <div className="grid items-center gap-12 lg:grid-cols-2">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-3xl font-bold text-foreground">Notre Histoire</h2>
                            <div className="mt-3 h-1 w-16 rounded-full bg-primary" />
                            <p className="mt-6 leading-relaxed text-muted-foreground">
                                Fondée au cœur de Casablanca, CEMAPROF est née de la vision d&apos;offrir aux professionnels marocains un accès facilité à du matériel professionnel de qualité. Ce qui a commencé comme une droguerie spécialisée s&apos;est transformé en une centrale d&apos;approvisionnement reconnue à l&apos;échelle nationale.
                            </p>
                            <p className="mt-4 leading-relaxed text-muted-foreground">
                                Aujourd&apos;hui, nous servons plus de 1000 clients — restaurants, hôtels, entreprises de BTP, administrations et commerces — avec un catalogue de plus de 500 références et un service après-vente réactif.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="overflow-hidden rounded-2xl shadow-card-hover"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80"
                                alt="Équipe CEMAPROF"
                                loading="lazy"
                                className="aspect-[4/3] w-full object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="section-py bg-surface">
                <div className="container-wide">
                    <SectionTitle title="Notre Mission & Valeurs" subtitle="Ce qui guide chacune de nos actions au quotidien" />
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

            <CounterSection stats={stats} />

            {/* Team */}
            <section className="section-py">
                <div className="container-wide">
                    <SectionTitle title="Notre Équipe" subtitle="Des professionnels passionnés à votre service" />
                    <div className="grid gap-8 sm:grid-cols-3">
                        {team.map((member, i) => (
                            <Card key={i} className="border-0 text-center shadow-card transition-all duration-300 hover:shadow-card-hover">
                                <CardContent className="p-8">
                                    <div className={`mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full text-2xl font-bold text-white ${member.color}`}>
                                        {member.initials}
                                    </div>
                                    <h3 className="text-lg font-semibold">{member.name}</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">{member.role}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <PageCta
                eyebrow="Travaillons ensemble"
                title="Prêt à travailler avec nous ?"
                description="Contactez notre équipe pour discuter de vos besoins en matériel professionnel."
            />
        </MainLayout>
    );
}
