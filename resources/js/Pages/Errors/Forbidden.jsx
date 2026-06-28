import { Head, Link } from '@inertiajs/react';
import { ShieldX } from 'lucide-react';
import { Button } from '@/Components/ui/button';

export default function Forbidden({ status = 403, message = 'Accès non autorisé.' }) {
    return (
        <>
            <Head title="Accès refusé" />
            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
                <ShieldX className="mb-4 h-16 w-16 text-accent" />
                <h1 className="text-2xl font-bold text-foreground">Erreur {status}</h1>
                <p className="mt-2 max-w-md text-muted-foreground">{message}</p>
                <div className="mt-8 flex gap-3">
                    <Button asChild variant="outline">
                        <Link href="/">Retour au site</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/admin/login">Connexion admin</Link>
                    </Button>
                </div>
            </div>
        </>
    );
}
