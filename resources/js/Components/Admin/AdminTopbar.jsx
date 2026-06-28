import { Link, router, usePage } from '@inertiajs/react';
import { LogOut, User } from 'lucide-react';
import { Button } from '@/Components/ui/button';

export default function AdminTopbar({ title }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const logout = () => router.post('/admin/logout');

    return (
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white px-4 py-4 lg:px-8">
            <div className="flex items-center justify-between gap-4 pl-12 lg:pl-0">
                <div>
                    <h1 className="text-xl font-bold text-foreground lg:text-2xl">{title}</h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden items-center gap-2 sm:flex">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <User className="h-4 w-4" />
                        </div>
                        <div className="text-sm">
                            <p className="font-medium">{user?.name}</p>
                            <p className="text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={logout}>
                        <LogOut className="mr-1 h-4 w-4" />
                        Déconnexion
                    </Button>
                </div>
            </div>
        </header>
    );
}
