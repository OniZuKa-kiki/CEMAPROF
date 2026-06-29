import { useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ChevronDown,
    HelpCircle,
    Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { matchesSearch } from '@/lib/searchNormalize';
import { faqIconMap } from '@/lib/faqIcons';

const iconMap = faqIconMap;

export default function FaqAccordion({ items = [] }) {
    const [openKey, setOpenKey] = useState(items[0]?.q ?? null);
    const [query, setQuery] = useState('');

    const filtered = useMemo(() => {
        const q = query.trim();
        if (!q) {
            return items;
        }
        return items.filter(
            (item) => matchesSearch(item.q, q) || matchesSearch(item.a, q),
        );
    }, [items, query]);

    const toggle = (key) => {
        setOpenKey((current) => (current === key ? null : key));
    };

    return (
        <div className="faq-accordion">
            <motion.div
                className="faq-accordion__intro"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
            >
                <div className="faq-accordion__intro-icon" aria-hidden="true">
                    <HelpCircle className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="faq-accordion__intro-title">Besoin d&apos;une réponse rapide ?</h2>
                    <p className="faq-accordion__intro-text">
                        Parcourez les questions les plus posées ou utilisez la recherche ci-dessous.
                    </p>
                </div>
            </motion.div>

            <motion.div
                className="faq-accordion__search-wrap"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.08 }}
            >
                <Search className="faq-accordion__search-icon" aria-hidden="true" />
                <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher une question…"
                    className="faq-accordion__search"
                    aria-label="Rechercher dans la FAQ"
                />
            </motion.div>

            <div className="faq-accordion__list">
                {filtered.length === 0 ? (
                    <p className="faq-accordion__empty">Aucune question ne correspond à votre recherche.</p>
                ) : filtered.map((item, index) => {
                    const isOpen = openKey === item.q;
                    const Icon = iconMap[item.icon] ?? HelpCircle;

                    return (
                        <motion.div
                            key={item.q}
                            className={cn('faq-accordion__item', isOpen && 'faq-accordion__item--open')}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.38, delay: index * 0.05 }}
                            layout
                        >
                            <button
                                type="button"
                                className="faq-accordion__trigger"
                                onClick={() => toggle(item.q)}
                                aria-expanded={isOpen}
                            >
                                <span className="faq-accordion__index">{String(index + 1).padStart(2, '0')}</span>
                                <span className="faq-accordion__icon" aria-hidden="true">
                                    <Icon className="h-4 w-4" />
                                </span>
                                <span className="faq-accordion__question">{item.q}</span>
                                <ChevronDown
                                    className={cn('faq-accordion__chevron', isOpen && 'faq-accordion__chevron--open')}
                                    aria-hidden="true"
                                />
                            </button>

                            <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.div
                                        className="faq-accordion__panel"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
                                    >
                                        <p className="faq-accordion__answer">{item.a}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            <motion.div
                className="faq-accordion__cta"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
            >
                <p>Toujours pas la réponse que vous cherchez ?</p>
                <Link href="/contact" className="faq-accordion__cta-link">
                    Contactez-nous directement →
                </Link>
            </motion.div>
        </div>
    );
}
