import { Head, useForm } from '@inertiajs/react';
import { Lock, Shield } from 'lucide-react';
import SiteLogo from '@/Components/SiteLogo';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';

export default function AdminLogin({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Connexion Admin">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20">
                            <Shield className="h-8 w-8 text-primary" />
                        </div>
                        <SiteLogo size="md" className="mx-auto" />
                        <h1 className="mt-4 text-2xl font-bold text-white">Administration</h1>
                        <p className="mt-2 text-sm text-gray-400">Accès réservé aux administrateurs</p>
                    </div>

                    <div className="rounded-2xl border border-gray-800 bg-gray-950 p-8 shadow-xl">
                        {status && (
                            <p className="mb-4 rounded-lg bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">{status}</p>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <Label htmlFor="email" className="text-gray-300">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="username"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mt-1.5 border-gray-700 bg-gray-900 text-white"
                                    required
                                />
                                {errors.email && <p className="mt-1 text-sm text-accent">{errors.email}</p>}
                            </div>

                            <div>
                                <Label htmlFor="password" className="text-gray-300">Mot de passe</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="mt-1.5 border-gray-700 bg-gray-900 text-white"
                                    required
                                />
                                {errors.password && <p className="mt-1 text-sm text-accent">{errors.password}</p>}
                            </div>

                            <Button type="submit" className="w-full" disabled={processing}>
                                <Lock className="mr-2 h-4 w-4" />
                                {processing ? 'Connexion...' : 'Se connecter'}
                            </Button>
                        </form>
                    </div>

                    <p className="mt-6 text-center text-xs text-gray-500">
                        Connexion sécurisée — tentatives limitées
                    </p>
                </div>
            </div>
        </>
    );
}
