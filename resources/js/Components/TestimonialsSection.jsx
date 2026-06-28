import { Star } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/Components/ui/carousel';

const testimonials = [
    {
        name: 'Karim Tazi',
        role: 'Artisan BTP, Tazi Construction',
        initials: 'KT',
        color: 'bg-emerald-600',
        rating: 5,
        text: 'Pour l\'outillage et la quincaillerie, CEMAPROF est notre référence à Casablanca. Stock permanent, bons conseils et délais respectés.',
    },
    {
        name: 'Fatima El Amrani',
        role: 'Responsable achats, exploitation agricole',
        initials: 'FA',
        color: 'bg-accent',
        rating: 5,
        text: 'Pompes, tuyauterie et matériel agricole — un service réactif qui comprend nos besoins terrain. Je recommande.',
    },
    {
        name: 'Ahmed Benali',
        role: 'Chef d\'atelier maintenance industrielle',
        initials: 'AB',
        color: 'bg-primary',
        rating: 5,
        text: 'Large choix en EPI et consommables industriels. CEMAPROF nous fournit régulièrement avec des tarifs compétitifs.',
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
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${testimonial.color}`}>
                    {testimonial.initials}
                </div>
                <div className="min-w-0">
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
                        Industrie, agriculture, BTP et artisans — des retours concrets de nos clients professionnels.
                    </p>
                </div>

                <div className="hidden gap-6 md:grid md:grid-cols-3">
                    {testimonials.map((t, i) => (
                        <TestimonialCard key={i} testimonial={t} />
                    ))}
                </div>

                <div className="md:hidden">
                    <Carousel opts={{ align: 'center', loop: true }} className="testimonials-carousel">
                        <CarouselContent className="ml-0">
                            {testimonials.map((t, i) => (
                                <CarouselItem key={i} className="basis-full pl-0">
                                    <TestimonialCard testimonial={t} />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <div className="testimonials-carousel__nav" aria-label="Navigation des témoignages">
                            <CarouselPrevious className="testimonials-carousel__arrow" />
                            <CarouselNext className="testimonials-carousel__arrow" />
                        </div>
                    </Carousel>
                </div>
            </div>
        </section>
    );
}
