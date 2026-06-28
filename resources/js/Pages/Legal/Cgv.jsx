import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { PageHero } from '@/Components/PageHero';

const sections = [
    {
        title: '1. Objet',
        content: 'Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre CEMAPROF, importateur distributeur d\'outillage et matériel industriel et agricole, et tout client professionnel ou particulier souhaitant acquérir des produits via notre site ou nos canaux de contact.',
    },
    {
        title: '2. Devis et commande',
        content: 'Toute commande fait l\'objet d\'un devis préalable. Le devis est valable 30 jours sauf mention contraire. La commande devient ferme après acceptation écrite du devis par le client (signature, e-mail ou validation explicite).',
    },
    {
        title: '3. Prix',
        content: 'Les prix sont exprimés en dirhams marocains (MAD), hors taxes sauf indication contraire. Les tarifs indicatifs affichés sur le site peuvent évoluer ; seul le devis accepté fait foi.',
    },
    {
        title: '4. Livraison',
        content: 'Les délais de livraison sont communiqués sur le devis. CEMAPROF informe le client en cas de retard. Les risques sont transférés à la réception du matériel.',
    },
    {
        title: '5. Garantie',
        content: 'Les produits bénéficient de la garantie constructeur lorsqu\'elle s\'applique. Les conditions spécifiques (durée, exclusions) sont précisées sur le devis ou la documentation du fabricant.',
    },
    {
        title: '6. Réclamations',
        content: 'Toute réclamation concernant la conformité ou l\'état du matériel doit être formulée par écrit dans les délais légaux à compter de la réception. Contactez-nous via le formulaire ou par téléphone.',
    },
    {
        title: '7. Données personnelles',
        content: 'Les informations collectées via le formulaire contact servent uniquement au traitement de votre demande de devis ou commande. Pour toute question relative à vos données, contactez-nous à contact@cemaprof.ma.',
    },
    {
        title: '8. Litiges',
        content: 'En cas de litige, une solution amiable sera recherchée en priorité. À défaut, les tribunaux de Casablanca seront seuls compétents, sous réserve des dispositions légales impératives.',
    },
];

export default function CgvIndex() {
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
