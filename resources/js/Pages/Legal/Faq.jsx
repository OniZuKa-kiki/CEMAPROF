import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { PageHero } from '@/Components/PageHero';
import PageCta from '@/Components/PageCta';

const faqs = [
    {
        q: 'Quels produits propose CEMAPROF ?',
        a: 'Importateur distributeur d\'outillage et matériel industriel et agricole, tuyauterie, pompes et motopompes, protection individuelle (EPI), quincaillerie et droguerie générale. Parcourez le catalogue ou contactez-nous pour un besoin spécifique.',
    },
    {
        q: 'Comment demander un devis pour plusieurs produits ?',
        a: 'Depuis le catalogue, cliquez sur « Ajouter à ma sélection » pour chaque article souhaité. Un panneau devis apparaît en bas de page : vérifiez votre liste puis finalisez la demande sur la page contact ou via WhatsApp.',
    },
    {
        q: 'Les prix affichés sont-ils définitifs ?',
        a: 'Les prix indicatifs servent de référence. Le tarif final dépend des quantités, références exactes et conditions de livraison. Un devis détaillé vous est toujours communiqué avant validation.',
    },
    {
        q: 'Livrez-vous partout au Maroc ?',
        a: 'Oui, la livraison est assurée sur l\'ensemble du territoire marocain. Les délais et frais sont précisés dans votre devis.',
    },
    {
        q: 'Où êtes-vous situés ?',
        a: 'Boulevard des Forces Auxiliaires, Hay Moulay Rachid, Casablanca. L\'adresse exacte est indiquée sur la page contact avec une carte Google Maps.',
    },
    {
        q: 'Puis-je obtenir des conseils sur un produit ?',
        a: 'Oui. Contactez-nous par téléphone, WhatsApp ou formulaire pour être orienté sur l\'outillage, les pompes, la tuyauterie ou les EPI adaptés à votre activité.',
    },
    {
        q: 'Quels moyens de paiement acceptez-vous ?',
        a: 'Les modalités de paiement (virement, chèque, conditions professionnelles) sont définies dans le devis selon votre profil et le montant de la commande.',
    },
];

export default function FaqIndex() {
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
                <div className="container-wide mx-auto max-w-3xl space-y-4">
                    {faqs.map((item, index) => (
                        <details key={index} className="faq-item group">
                            <summary className="faq-item__question">{item.q}</summary>
                            <p className="faq-item__answer">{item.a}</p>
                        </details>
                    ))}
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
