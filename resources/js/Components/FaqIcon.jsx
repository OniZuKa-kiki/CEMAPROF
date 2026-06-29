import { HelpCircle } from 'lucide-react';
import { faqIconMap } from '@/lib/faqIcons';

export function FaqIcon({ name, className = 'h-4 w-4' }) {
    const Icon = faqIconMap[name] ?? HelpCircle;

    return <Icon className={className} aria-hidden="true" />;
}
