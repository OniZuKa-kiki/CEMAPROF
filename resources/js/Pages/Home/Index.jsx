import { Head, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import HomeHero from '@/Components/HomeHero';
import CategoryShowcaseSlider from '@/Components/CategoryShowcaseSlider';
import BrandMarquee from '@/Components/BrandMarquee';
import FeaturedProductsSlider from '@/Components/FeaturedProductsSlider';
import CounterSection from '@/Components/CounterSection';
import PageCta from '@/Components/PageCta';
import TestimonialsSection from '@/Components/TestimonialsSection';
import JsonLd from '@/Components/JsonLd';
import { LOGO_PATH } from '@/lib/siteAssets';
import { buildOrganizationSchema, buildWebSiteSchema } from '@/lib/structuredData';

export default function Home({ featuredProducts, categories, stats, partnerBrands }) {
    const { company, appUrl, siteSettings } = usePage().props;
    const organizationSchema = buildOrganizationSchema({ appUrl, company, siteSettings });
    const websiteSchema = buildWebSiteSchema(appUrl);

    return (
        <MainLayout>
            <Head title="Accueil — Outillage & Matériel Industriel">
                <meta head-key="description" name="description" content={company?.description ?? 'CEMAPROF — Importateur distributeur outillage, matériel industriel et agricole, tuyauterie, pompes, EPI, quincaillerie et droguerie à Casablanca.'} />
                <link head-key="canonical" rel="canonical" href={appUrl || '/'} />
                <meta head-key="og:title" property="og:title" content="CEMAPROF — Importateur · Distributeur" />
                <meta head-key="og:description" property="og:description" content={company?.short_description ?? 'Votre partenaire pour l\'outillage et le matériel industriel au Maroc.'} />
                <meta head-key="og:image" property="og:image" content={LOGO_PATH} />
                <JsonLd data={organizationSchema} id="organization" />
                <JsonLd data={websiteSchema} id="website" />
            </Head>

            <HomeHero />

            <CategoryShowcaseSlider categories={categories} />

            <BrandMarquee brands={partnerBrands} />

            <FeaturedProductsSlider products={featuredProducts} />

            <CounterSection stats={stats} />
            <TestimonialsSection />

            <PageCta />
        </MainLayout>
    );
}
