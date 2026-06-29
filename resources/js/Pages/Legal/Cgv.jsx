import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { PageHero } from '@/Components/PageHero';

export default function CgvIndex({ sections = [] }) {
    return (
        <MainLayout>
            <Head title="CGV — Conditions Générales de Vente">
                <meta head-key="description" name="description" content="Conditions générales de vente CEMAPROF : devis, commandes, livraison, garantie — importateur distributeur à Casablanca." />
            </Head>

            <PageHero
                title="Conditions Générales de Vente"
                subtitle="Cadre contractuel de nos prestations"
                eyebrow="Informations légales"
                breadcrumb={[{ label: 'CGV' }]}
            />

            <section className="section-py">
                <div className="container-wide mx-auto max-w-3xl">
                    <p className="mb-8 text-muted-foreground leading-relaxed">
                        Dernière mise à jour : juin {new Date().getFullYear()}. CEMAPROF — Boulevard des Forces Auxiliaires,
                        Hay Moulay Rachid, Casablanca. Pour toute question,{' '}
                        <Link href="/contact" className="font-medium text-primary hover:underline">contactez-nous</Link>.
                    </p>
                    <div className="space-y-8">
                        {sections.map((section) => (
                            <div key={section.title} className="legal-section">
                                <h2 className="legal-section__title">{section.title}</h2>
                                <p className="legal-section__text">{section.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
