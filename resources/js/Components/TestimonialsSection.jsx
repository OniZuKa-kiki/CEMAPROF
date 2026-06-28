import { Star } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/Components/ui/carousel';

const testimonials = [
    {
        name: 'Ahmed Benali',
        role: 'Directeur, Restaurant Le Jardin',
        initials: 'AB',
        color: 'bg-primary',
        rating: 5,
        text: 'CEMAPROF nous équipe depuis 5 ans. Qualité irréprochable, livraison rapide et un SAV réactif. Je recommande vivement pour tout matériel professionnel.',
    },
    {
        name: 'Fatima El Amrani',
        role: 'Gérante, Hôtel Atlas Palace',
        initials: 'FA',
        color: 'bg-accent',
        rating: 5,
        text: 'Un partenaire de confiance pour notre hôtel. Large gamme de produits, prix compétitifs et conseils personnalisés. L\'équipe est toujours disponible.',
    },
    {
        name: 'Karim Tazi',
        role: 'Artisan BTP, Tazi Construction',
        initials: 'KT',
        color: 'bg-emerald-600',
        rating: 5,
        text: 'Pour l\'outillage professionnel, CEMAPROF est notre référence au Maroc. Des marques reconnues, un stock permanent et des délais respectés.',
    },
];

function TestimonialCard({ testimonial }) {
    return (
        <div className="testimonial-card reveal-on-scroll flex h-full flex-col">
            <div className="mb-4 flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
            </div>
            <p className="flex-1 text-sm leading-relaxed text-muted-foreground">&ldquo;{testimonial.text}&rdquo;</p>
            <div className="mt-6 flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white ${testimonial.color}`}>
                    {testimonial.initials}
                </div>
                <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
            </div>
        </div>
    );
}

export default function TestimonialsSection() {
    return (
        <section className="section-py bg-surface">
            <div className="container-wide">
                <div className="reveal-on-scroll mb-12 text-center">
                    <h2 className="section-accent mx-auto inline-block text-3xl font-bold text-foreground sm:text-4xl">
                        Ils nous font confiance au quotidien
                    </h2>
                    <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
                        Restaurateurs, hôteliers, artisans — des retours concrets, pas des slogans.
                    </p>
                </div>

                <div className="hidden gap-6 md:grid md:grid-cols-3">
                    {testimonials.map((t, i) => (
                        <TestimonialCard key={i} testimonial={t} />
                    ))}
                </div>

                <div className="md:hidden">
                    <Carousel opts={{ align: 'start', loop: true }}>
                        <CarouselContent>
                            {testimonials.map((t, i) => (
                                <CarouselItem key={i}>
                                    <TestimonialCard testimonial={t} />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-0" />
                        <CarouselNext className="right-0" />
                    </Carousel>
                </div>
            </div>
        </section>
    );
}
