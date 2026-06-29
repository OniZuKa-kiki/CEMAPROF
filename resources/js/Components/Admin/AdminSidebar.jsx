import { Link, router, usePage } from '@inertiajs/react';
import SiteLogo from '@/Components/SiteLogo';
import {
    Award,
    ExternalLink,
    FileText,
    HelpCircle,
    LayoutDashboard,
    Mail,
    Menu,
    Package,
    ScrollText,
    Settings,
    Tags,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/Components/ui/sheet';
import { Button } from '@/Components/ui/button';
import { useEffect, useState } from 'react';

const navItems = [
    { href: '/admin', routeName: 'admin.dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/products', routeName: 'admin.products.index', label: 'Produits', icon: Package },
    { href: '/admin/categories', routeName: 'admin.categories.index', label: 'Catégories', icon: Tags },
    { href: '/admin/brands', routeName: 'admin.brands.index', label: 'Marques', icon: Award },
    { href: '/admin/messages', routeName: 'admin.messages.index', label: 'Messages', icon: Mail, badgeKey: 'unreadMessages' },
    { href: '/admin/content/faq', routeName: 'admin.content.faq', label: 'FAQ', icon: HelpCircle },
    { href: '/admin/content/cgv', routeName: 'admin.content.cgv', label: 'CGV', icon: ScrollText },
    { href: '/admin/content/partner-brands', routeName: 'admin.content.partner-brands', label: 'Bandeau marques', icon: FileText },
    { href: '/admin/settings', routeName: 'admin.settings.edit', label: 'Paramètres', icon: Settings },
];

function resolveHref(item) {
    if (typeof route === 'function') {
        try {
            return route(item.routeName);
        } catch {
            return item.href;
        }
    }

    return item.href;
}

function NavLink({ item, onClick }) {
    const page = usePage();
    const href = resolveHref(item);
    const badge = item.badgeKey ? page.props.admin?.[item.badgeKey] : 0;
    const isActive = item.exact
        ? page.url === href || page.url === item.href
        : page.url.startsWith(href) || page.url.startsWith(item.href);

    const handleClick = (event) => {
        onClick?.();

        if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return;
        }

        event.preventDefault();
        router.visit(href, { preserveScroll: false });
    };

    return (
        <Link
            href={href}
            onClick={handleClick}
            className={cn(
                'admin-sidebar__link relative z-10 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                isActive ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white',
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
                <SiteLogo size="md" className="max-w-[200px]" />
                <p className="mt-2 text-xs text-gray-400">Administration</p>
            </div>
            <nav className="admin-sidebar__nav flex-1 space-y-1 p-4">
                {navItems.map((item) => (
                    <NavLink key={item.routeName} item={item} onClick={onNavigate} />
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

    useEffect(() => {
        document.querySelectorAll('[data-radix-dialog-overlay]').forEach((overlay) => {
            if (overlay.getAttribute('data-state') === 'closed') {
                overlay.remove();
            }
        });
    }, []);

    return (
        <>
            <aside className="admin-sidebar relative z-50 hidden w-64 shrink-0 bg-gray-900 lg:block">
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
