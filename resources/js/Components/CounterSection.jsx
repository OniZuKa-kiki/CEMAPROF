import { useEffect, useRef, useState } from 'react';

function AnimatedCounter({ value, suffix = '', duration = 2000 }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    const startTime = performance.now();

                    const animate = (currentTime) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        setCount(Math.floor(eased * value));

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            setCount(value);
                        }
                    };

                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [value, duration]);

    return (
        <span ref={ref}>
            {count}{suffix}
        </span>
    );
}

export default function CounterSection({ stats, className = '' }) {
    return (
        <section className={`stats-section reveal-on-scroll ${className}`}>
            <div
                className="stats-section__bg"
                style={{
                    backgroundImage: "url('/images/stats-bg.jpg'), url('https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1600&q=80')",
                }}
                aria-hidden="true"
            />
            <div className="stats-section__overlay" aria-hidden="true" />
            <div className="stats-section__content mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="stat-block text-center">
                            <p className="text-4xl font-bold text-white sm:text-5xl">
                                <AnimatedCounter value={stat.value} suffix={stat.suffix || ''} />
                            </p>
                            <p className="mt-2 text-sm text-white/85 sm:text-base">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
