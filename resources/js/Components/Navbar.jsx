import { Link, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Menu, Search, X } from "lucide-react";
import SiteLogo from "@/Components/SiteLogo";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/Components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
    { href: "/", label: "Accueil", route: "home" },
    { href: "/produits", label: "Produits", route: "products" },
    { href: "/a-propos", label: "À propos", route: "about" },
    { href: "/contact", label: "Contact", route: "contact" },
];

export default function Navbar() {
    const { url } = usePage();
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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

    return (
        <header
            className={cn(
                "fixed top-0 z-50 w-full transition-all duration-300",
                scrolled ? "navbar-glass" : "bg-white/80 backdrop-blur-sm",
            )}
        >
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex shrink-0 items-center">
                    <SiteLogo size="sm" />
                </Link>

                <nav className="hidden items-center gap-1 lg:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                                isActive(link.href)
                                    ? "bg-primary/10 text-primary"
                                    : "text-foreground hover:bg-surface hover:text-primary",
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden items-center gap-3 md:flex">
                    {searchOpen ? (
                        <form
                            onSubmit={handleSearch}
                            className="flex items-center gap-2"
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
                                onClick={() => setSearchOpen(false)}
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
                        >
                            <Search className="h-5 w-5" />
                        </Button>
                    )}
                    <Button variant="accent" asChild>
                        <Link href="/contact">Demander un devis</Link>
                    </Button>
                </div>

                <div className="flex items-center gap-2 lg:hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSearchOpen(!searchOpen)}
                    >
                        <Search className="h-5 w-5" />
                    </Button>
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Menu"
                            >
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px]">
                            <SheetHeader>
                                <SheetTitle>Menu</SheetTitle>
                            </SheetHeader>
                            <nav className="mt-8 flex flex-col gap-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={cn(
                                            "rounded-xl px-4 py-3 text-base font-medium transition-colors",
                                            isActive(link.href)
                                                ? "bg-primary text-white"
                                                : "hover:bg-surface",
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <Button
                                    variant="accent"
                                    className="mt-4"
                                    asChild
                                >
                                    <Link
                                        href="/contact"
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

            {searchOpen && (
                <div className="border-t border-gray-100 px-4 py-3 md:hidden">
                    <form onSubmit={handleSearch}>
                        <Input
                            type="search"
                            placeholder="Rechercher un produit..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                </div>
            )}
        </header>
    );
}
