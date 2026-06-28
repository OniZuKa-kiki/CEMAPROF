import { Link, usePage } from '@inertiajs/react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { FacebookIcon, InstagramIcon, LinkedInIcon } from '@/Components/SocialIcons';
import SiteLogo from '@/Components/SiteLogo';

export default function Footer() {
    const { siteSettings, navCategories, company } = usePage().props;

    const currentYear = new Date().getFullYear();

    return (
        <footer className="site-footer text-white" data-site-footer>
            <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
                    <div
                        className="reveal-on-scroll lg:col-span-4"
                        style={{ '--reveal-delay': '0ms' }}
                    >
                        <SiteLogo size="lg" className="mb-5" />
                        <p className="max-w-xs text-sm leading-relaxed text-gray-400">
                            {siteSettings?.company_description || company?.description || 'Importateur distributeur d\'outillage et matériel industriel et agricole à Casablanca.'}
                        </p>
                        <div className="mt-6 flex gap-3">
                            {siteSettings?.facebook && (
                                <a href={siteSettings.facebook} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-primary">
                                    <FacebookIcon className="h-5 w-5" />
                                </a>
                            )}
                            {siteSettings?.instagram && (
                                <a href={siteSettings.instagram} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-primary">
                                    <InstagramIcon className="h-5 w-5" />
                                </a>
                            )}
                            {siteSettings?.linkedin && (
                                <a href={siteSettings.linkedin} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-primary">
                                    <LinkedInIcon className="h-5 w-5" />
                                </a>
                            )}
                        </div>
                    </div>

                    <div
                        className="reveal-on-scroll lg:col-span-2 lg:col-start-6"
                        style={{ '--reveal-delay': '80ms' }}
                    >
                        <h3 className="footer-heading">Navigation</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/" className="transition-colors hover:text-white">Accueil</Link></li>
                            <li><Link href="/produits" className="transition-colors hover:text-white">Produits</Link></li>
                            <li><Link href="/a-propos" className="transition-colors hover:text-white">À propos</Link></li>
                            <li><Link href="/contact" className="transition-colors hover:text-white">Contact</Link></li>
                            <li><Link href="/faq" className="transition-colors hover:text-white">FAQ</Link></li>
                            <li><Link href="/cgv" className="transition-colors hover:text-white">CGV</Link></li>
                        </ul>
                    </div>

                    <div
                        className="reveal-on-scroll lg:col-span-3"
                        style={{ '--reveal-delay': '140ms' }}
                    >
                        <h3 className="footer-heading">Catégories</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            {navCategories?.map((cat) => (
                                <li key={cat.id}>
                                    <Link href={`/categories/${cat.slug}`} className="transition-colors hover:text-white">
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div
                        className="reveal-on-scroll lg:col-span-3"
                        style={{ '--reveal-delay': '200ms' }}
                    >
                        <h3 className="footer-heading">Contact</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            {siteSettings?.address && (
                                <li className="flex items-start gap-3">
                                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                                    <span>{siteSettings.address}</span>
                                </li>
                            )}
                            {siteSettings?.phone && (
                                <li className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 shrink-0 text-accent" />
                                    <a href={`tel:${siteSettings.phone.replace(/\s/g, '')}`} className="transition-colors hover:text-white">
                                        {siteSettings.phone}
                                    </a>
                                </li>
                            )}
                            {siteSettings?.email && (
                                <li className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 shrink-0 text-accent" />
                                    <a href={`mailto:${siteSettings.email}`} className="transition-colors hover:text-white">
                                        {siteSettings.email}
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                <div
                    className="reveal-on-scroll mt-12 border-t border-white/10 pt-8 text-center text-sm text-gray-500"
                    style={{ '--reveal-delay': '260ms' }}
                >
                    <p>&copy; {currentYear} CEMAPROF — Tous droits réservés.</p>
                    <p className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
                        <Link href="/cgv" className="hover:text-gray-300">CGV</Link>
                        <Link href="/faq" className="hover:text-gray-300">FAQ</Link>
                        <Link href="/contact" className="hover:text-gray-300">Contact</Link>
                    </p>
                </div>
            </div>
        </footer>
    );
}
