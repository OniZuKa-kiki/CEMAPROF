import { Link, usePage } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import {
    Building2,
    Home,
    Mail,
    Menu,
    Package,
    Search,
    X,
} from "lucide-react";
import SiteLogo from "@/Components/SiteLogo";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/Components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
    { href: "/", label: "Accueil", route: "home", icon: Home },
    { href: "/produits", label: "Produits", route: "products", icon: Package },
    { href: "/a-propos", label: "À propos", route: "about", icon: Building2 },
    { href: "/contact", label: "Contact", route: "contact", icon: Mail },
];

export default function Navbar() {
    const { url } = usePage();
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);
    const mobileSearchRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 12);
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (!searchOpen) return;
        const timer = window.setTimeout(() => mobileSearchRef.current?.focus(), 180);
        return () => window.clearTimeout(timer);
    }, [searchOpen]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/produits?search=${encodeURIComponent(searchQuery.trim())}`;
        }
    };

    const isActive = (href) => {
        if (href === "/") return url === "/";
        return url.startsWith(href);
    };

    const closeSearch = () => setSearchOpen(false);

    return (
        <header
            className={cn(
                "fixed top-0 z-50 w-full border-b border-gray-100/80 bg-white transition-shadow duration-300",
                scrolled && "navbar-elevated",
            )}
        >
            <div className="mx-auto flex h-[60px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex shrink-0 items-center">
                    <SiteLogo size="sm" />
                </Link>

                <nav className="hidden items-center gap-0.5 lg:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                                isActive(link.href)
                                    ? "bg-primary/10 text-primary"
                                    : "text-foreground/80 hover:bg-surface hover:text-primary",
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden items-center gap-2 md:flex">
                    <div
                        className={cn(
                            "navbar-search-desktop",
                            searchOpen && "navbar-search-desktop--open",
                        )}
                    >
                        {searchOpen ? (
                            <form
                                onSubmit={handleSearch}
                                className="navbar-search-desktop__form flex items-center gap-2"
                            >
                                <Input
                                    type="search"
                                    placeholder="Rechercher un produit..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-56 lg:w-64"
                                    autoFocus
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={closeSearch}
                                    aria-label="Fermer la recherche"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </form>
                        ) : (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSearchOpen(true)}
                                aria-label="Rechercher"
                                className="rounded-full bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary"
                            >
                                <Search className="h-5 w-5" />
                            </Button>
                        )}
                    </div>
                    <Button variant="accent" size="sm" asChild className="font-semibold">
                        <Link href="/contact?subject=devis">Devis gratuit</Link>
                    </Button>
                </div>

                <div className="flex items-center gap-1 lg:hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSearchOpen((open) => !open)}
                        aria-label={searchOpen ? "Fermer la recherche" : "Rechercher"}
                        aria-expanded={searchOpen}
                        className={cn(
                            "relative rounded-full transition-all duration-300",
                            searchOpen && "bg-primary/10 text-primary",
                        )}
                    >
                        <Search
                            className={cn(
                                "h-5 w-5 transition-all duration-300",
                                searchOpen && "scale-0 opacity-0",
                            )}
                        />
                        <X
                            className={cn(
                                "absolute h-5 w-5 transition-all duration-300",
                                searchOpen ? "scale-100 opacity-100 rotate-0" : "scale-75 opacity-0 rotate-90",
                            )}
                        />
                    </Button>
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
                            aria-expanded={mobileOpen}
                            onClick={() => setMobileOpen((open) => !open)}
                            className="relative rounded-full"
                        >
                            <Menu
                                className={cn(
                                    "h-6 w-6 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
                                    mobileOpen && "scale-0 opacity-0 rotate-45",
                                )}
                            />
                            <X
                                className={cn(
                                    "absolute h-6 w-6 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
                                    mobileOpen ? "scale-100 opacity-100 rotate-0" : "scale-75 opacity-0 -rotate-45",
                                )}
                            />
                        </Button>
                        <SheetContent
                            side="right"
                            className="sheet-mobile-nav w-[min(100vw-2rem,320px)]"
                        >
                            <SheetHeader className="border-b border-gray-100 pb-4 pr-10">
                                <SheetTitle className="text-left">
                                    <SiteLogo size="sm" />
                                </SheetTitle>
                            </SheetHeader>
                            <nav className="sheet-mobile-nav__links mt-6 flex flex-col gap-1">
                                {navLinks.map((link, index) => {
                                    const Icon = link.icon;
                                    const active = isActive(link.href);
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setMobileOpen(false)}
                                            style={{ animationDelay: `${80 + index * 50}ms` }}
                                            className={cn(
                                                "sheet-mobile-nav__link flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                                                active
                                                    ? "bg-primary/10 text-primary"
                                                    : "text-foreground hover:bg-surface",
                                            )}
                                        >
                                            <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} />
                                            {link.label}
                                        </Link>
                                    );
                                })}
                                <Button
                                    variant="accent"
                                    className="sheet-mobile-nav__cta mt-4 w-full font-semibold"
                                    style={{ animationDelay: "280ms" }}
                                    asChild
                                >
                                    <Link
                                        href="/contact?subject=devis"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        Demander un devis
                                    </Link>
                                </Button>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            <div
                className={cn("navbar-search-panel md:hidden", searchOpen && "navbar-search-panel--open")}
                aria-hidden={!searchOpen}
            >
                <div className="navbar-search-panel__inner">
                    <form onSubmit={handleSearch} className="navbar-search-panel__form border-t border-gray-100 bg-white px-4 py-3">
                        <Input
                            ref={mobileSearchRef}
                            type="search"
                            placeholder="Rechercher un produit..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            tabIndex={searchOpen ? 0 : -1}
                        />
                    </form>
                </div>
            </div>
        </header>
    );
}
