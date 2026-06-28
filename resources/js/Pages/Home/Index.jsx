import { Head, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import HomeHero from '@/Components/HomeHero';
import CategoryShowcaseSlider from '@/Components/CategoryShowcaseSlider';
import BrandMarquee from '@/Components/BrandMarquee';
import FeaturedProductsSlider from '@/Components/FeaturedProductsSlider';
import CounterSection from '@/Components/CounterSection';
import PageCta from '@/Components/PageCta';
import TestimonialsSection from '@/Components/TestimonialsSection';

export default function Home({ featuredProducts, categories, stats }) {
    const { company } = usePage().props;

    return (
        <MainLayout>
            <Head title="Accueil — Outillage & Matériel Industriel">
                <meta head-key="description" name="description" content={company?.description ?? 'CEMAPROF — Importateur distributeur outillage, matériel industriel et agricole, tuyauterie, pompes, EPI, quincaillerie et droguerie à Casablanca.'} />
                <meta head-key="og:title" property="og:title" content="CEMAPROF — Importateur · Distributeur" />
                <meta head-key="og:description" property="og:description" content={company?.short_description ?? 'Votre partenaire pour l\'outillage et le matériel industriel au Maroc.'} />
                <meta head-key="og:image" property="og:image" content="/images/logo.png" />
            </Head>

            <HomeHero />

            <CategoryShowcaseSlider categories={categories} />

            <BrandMarquee />

            <FeaturedProductsSlider products={featuredProducts} />

            <CounterSection stats={stats} />
            <TestimonialsSection />

            <PageCta />
        </MainLayout>
    );
}
