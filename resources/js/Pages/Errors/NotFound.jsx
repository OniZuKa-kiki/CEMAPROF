import { Head, Link } from '@inertiajs/react';
import { Home } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import SiteLogo from '@/Components/SiteLogo';
import { PageHero } from '@/Components/PageHero';
import { Button } from '@/Components/ui/button';

export default function NotFound() {
    return (
        <MainLayout>
            <Head title="Page introuvable — CEMAPROF" />

            <PageHero
                title="Page introuvable"
                subtitle="Désolé, la page que vous recherchez n'existe pas ou a été déplacée."
                eyebrow="Erreur 404"
            />

            <div className="container-wide section-py text-center">
                <SiteLogo size="lg" className="mx-auto mb-8 opacity-90" />
                <p className="error-code">404</p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                    <Button asChild>
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Retour à l&apos;accueil
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/produits">Voir nos produits</Link>
                    </Button>
                </div>
            </div>
        </MainLayout>
    );
}
