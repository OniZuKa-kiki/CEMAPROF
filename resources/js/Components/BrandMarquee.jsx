import { useEffect, useRef, useState } from 'react';
import { partnerBrands, getBrandLogoSources, getBrandScale } from '@/lib/brandLogos';

function BrandLogo({ brand }) {
    const sources = getBrandLogoSources(brand);
    const [sourceIndex, setSourceIndex] = useState(0);

    if (sourceIndex >= sources.length) {
        return (
            <span className="brand-marquee__fallback" title={brand.name}>
                {brand.name}
            </span>
        );
    }

    return (
        <img
            src={sources[sourceIndex]}
            alt={brand.name}
            className="brand-marquee__logo"
            style={{ '--brand-scale': getBrandScale(brand) }}
            loading="eager"
            decoding="async"
            onError={() => setSourceIndex((current) => current + 1)}
        />
    );
}

export default function BrandMarquee() {
    const trackRef = useRef(null);
    const offsetRef = useRef(0);
    const pausedRef = useRef(false);
    const track = [...partnerBrands, ...partnerBrands, ...partnerBrands, ...partnerBrands];

    useEffect(() => {
        let frameId = 0;
        let lastTime = 0;
        const speed = 42;

        const step = (time) => {
            if (!trackRef.current) {
                frameId = requestAnimationFrame(step);
                return;
            }

            if (!lastTime) {
                lastTime = time;
            }

            const delta = time - lastTime;
            lastTime = time;

            if (!pausedRef.current) {
                const loopWidth = trackRef.current.scrollWidth / 2;
                offsetRef.current -= (speed * delta) / 1000;

                if (Math.abs(offsetRef.current) >= loopWidth) {
                    offsetRef.current = 0;
                }

                trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
            }

            frameId = requestAnimationFrame(step);
        };

        frameId = requestAnimationFrame(step);

        return () => cancelAnimationFrame(frameId);
    }, []);

    return (
        <section className="brand-marquee" aria-label="Marques partenaires">
            <div className="container-wide brand-marquee__inner">
                <div className="brand-marquee__label">
                    <span className="brand-marquee__dot" aria-hidden="true" />
                    Marques de confiance
                </div>
            </div>

            <div
                className="brand-marquee__viewport"
                onMouseEnter={() => { pausedRef.current = true; }}
                onMouseLeave={() => { pausedRef.current = false; }}
            >
                <div ref={trackRef} className="brand-marquee__track">
                    {track.map((brand, index) => (
                        <div key={`${brand.slug}-${index}`} className="brand-marquee__item">
                            <BrandLogo brand={brand} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
