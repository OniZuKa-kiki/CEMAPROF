import { Link, router, usePage } from "@inertiajs/react";
import { useState, useEffect, useCallback, useRef } from "react";
import { smoothScrollToTop } from "@/lib/smoothScroll";
import {
    Building2,
    Home,
    Mail,
    Menu,
    Package,
    X,
} from "lucide-react";
import SiteLogo from "@/Components/SiteLogo";
import ProductSearchInput from "@/Components/ProductSearchInput";
import { Button } from "@/Components/ui/button";
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

const SEARCH_COLLAPSE_THRESHOLD = 72;

export default function Navbar() {
    const { url } = usePage();
    const [scrolled, setScrolled] = useState(false);
    const [searchCollapsed, setSearchCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);
    const lastScrollY = useRef(0);

    const isCatalogPage = url.startsWith("/produits");
    const showSearchStrip = !isCatalogPage;

    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY;
            setScrolled(y > 12);

            if (showSearchStrip) {
                if (y <= SEARCH_COLLAPSE_THRESHOLD) {
                    setSearchCollapsed(false);
                } else if (y > lastScrollY.current + 4) {
                    setSearchCollapsed(true);
                } else if (y < lastScrollY.current - 4) {
                    setSearchCollapsed(false);
                }
            }

            lastScrollY.current = y;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, [showSearchStrip]);

    const handleSearch = (query) => {
        if (query) {
            router.visit(`/produits?search=${encodeURIComponent(query)}`);
        }
    };

    const isActive = (href) => {
        if (href === "/") return url === "/";
        return url.startsWith(href);
    };

    const handleNavClick = useCallback((event, href) => {
        if (href === "/" && (url === "/" || url === "")) {
            event.preventDefault();
            smoothScrollToTop(700);
        }
    }, [url]);

    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle('nav-catalog-page', isCatalogPage);
        root.classList.toggle('nav-search-collapsed', showSearchStrip && searchCollapsed);

        return () => {
            root.classList.remove('nav-catalog-page', 'nav-search-collapsed');
        };
    }, [isCatalogPage, showSearchStrip, searchCollapsed]);

    return (
        <header
            className={cn(
                "site-navbar fixed z-50 w-full border-b border-gray-100/80 bg-white transition-shadow duration-300",
                scrolled && "navbar-elevated",
                isCatalogPage && "site-navbar--catalog",
                searchCollapsed && showSearchStrip && "site-navbar--search-collapsed",
            )}
        >
            <div className="mx-auto flex h-[var(--site-navbar-main-height)] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <Link href="/" onClick={(event) => handleNavClick(event, "/")} className="flex shrink-0 items-center">
                    <SiteLogo size="sm" />
                </Link>

                <nav className="hidden items-center gap-0.5 lg:flex">
                    {navLinks.map((link) => {
                        const active = isActive(link.href);

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={(event) => handleNavClick(event, link.href)}
                                className={cn("navbar-link", active && "navbar-link--active")}
                                aria-current={active ? "page" : undefined}
                            >
                                <span className="navbar-link__label">{link.label}</span>
                                <span className="navbar-link__line" aria-hidden="true" />
                            </Link>
                        );
                    })}
                </nav>

                <div className="hidden items-center gap-2 md:flex">
                    <Button variant="accent" size="sm" asChild className="font-semibold">
                        <Link href="/contact?subject=devis">Devis gratuit</Link>
                    </Button>
                </div>

                <div className="flex items-center gap-1 lg:hidden">
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
                                            onClick={(event) => {
                                                handleNavClick(event, link.href);
                                                setMobileOpen(false);
                                            }}
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

            {showSearchStrip && (
                <div
                    className={cn(
                        "navbar-search-strip",
                        searchCollapsed && "navbar-search-strip--collapsed",
                    )}
                >
                    <div className="navbar-search-strip__inner mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <ProductSearchInput
                            variant="navbar"
                            value={searchQuery}
                            onChange={setSearchQuery}
                            onSubmit={handleSearch}
                            placeholder="Rechercher un produit, une référence, une catégorie…"
                        />
                    </div>
                </div>
            )}
        </header>
    );
}
