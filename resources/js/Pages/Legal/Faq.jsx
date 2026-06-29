import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { PageHero } from '@/Components/PageHero';
import PageCta from '@/Components/PageCta';
import FaqAccordion from '@/Components/FaqAccordion';

export default function FaqIndex({ items = [] }) {
    return (
        <MainLayout>
            <Head title="FAQ — Questions fréquentes">
                <meta head-key="description" name="description" content="Réponses aux questions fréquentes sur les commandes, devis, livraison et produits CEMAPROF à Casablanca." />
            </Head>

            <PageHero
                title="Questions fréquentes"
                subtitle="Outillage, industrie, agriculture, tuyauterie & quincaillerie"
                eyebrow="Aide"
                breadcrumb={[{ label: 'FAQ' }]}
            />

            <section className="section-py">
                <div className="container-wide mx-auto max-w-3xl">
                    <FaqAccordion items={items} />
                </div>
            </section>

            <PageCta
                eyebrow="Une autre question ?"
                title="Contactez CEMAPROF"
                description="Formulaire ou WhatsApp — nous vous répondons rapidement."
            />
        </MainLayout>
    );
}
