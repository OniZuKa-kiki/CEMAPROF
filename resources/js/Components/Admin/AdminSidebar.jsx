import { Link, usePage } from '@inertiajs/react';
import SiteLogo from '@/Components/SiteLogo';
import {
    ExternalLink, LayoutDashboard, Mail, Menu, Package, Settings, Tags,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/Components/ui/sheet';
import { Button } from '@/Components/ui/button';
import { useState } from 'react';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/products', label: 'Produits', icon: Package },
    { href: '/admin/categories', label: 'Catégories', icon: Tags },
    { href: '/admin/messages', label: 'Messages', icon: Mail, badgeKey: 'unreadMessages' },
    { href: '/admin/settings', label: 'Paramètres', icon: Settings },
];

function NavLink({ item, onClick }) {
    const page = usePage();
    const badge = item.badgeKey ? page.props.admin?.[item.badgeKey] : 0;
    const isActive = item.exact ? page.url === item.href : page.url.startsWith(item.href);

    return (
        <Link
            href={item.href}
            onClick={onClick}
            className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                isActive ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            )}
        >
            <item.icon className="h-5 w-5 shrink-0" />
            <span className="flex-1">{item.label}</span>
            {badge > 0 && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent px-1.5 text-xs font-bold text-white">
                    {badge}
                </span>
            )}
        </Link>
    );
}

function SidebarContent({ onNavigate }) {
    return (
        <div className="flex h-full flex-col">
            <div className="border-b border-gray-800 p-6">
                <SiteLogo size="sm" />
                <p className="mt-2 text-xs text-gray-400">Administration</p>
            </div>
            <nav className="flex-1 space-y-1 p-4">
                {navItems.map((item) => (
                    <NavLink key={item.href} item={item} onClick={onNavigate} />
                ))}
            </nav>
            <div className="border-t border-gray-800 p-4">
                <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
                >
                    <ExternalLink className="h-5 w-5" />
                    Voir le site
                </a>
            </div>
        </div>
    );
}

export default function AdminSidebar() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <aside className="hidden w-64 shrink-0 bg-gray-900 lg:block">
                <div className="sticky top-0 h-screen overflow-y-auto">
                    <SidebarContent />
                </div>
            </aside>

            <div className="fixed left-4 top-4 z-50 lg:hidden">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button size="icon" variant="outline" className="bg-white">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-72 border-0 bg-gray-900 p-0 text-white">
                        <SidebarContent onNavigate={() => setOpen(false)} />
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}
