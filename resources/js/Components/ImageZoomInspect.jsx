import { useCallback, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const canHoverZoom = () =>
    typeof window !== 'undefined'
    && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/**
 * E-commerce style image inspect: zoom follows cursor position on hover.
 */
export default function ImageZoomInspect({
    src,
    alt,
    className,
    imgClassName,
    zoom = 2.2,
}) {
    const containerRef = useRef(null);
    const [active, setActive] = useState(false);
    const [origin, setOrigin] = useState({ x: 50, y: 50 });

    const handleMove = useCallback((event) => {
        const element = containerRef.current;
        if (!element || !canHoverZoom()) {
            return;
        }

        const { left, top, width, height } = element.getBoundingClientRect();
        const x = Math.max(0, Math.min(100, ((event.clientX - left) / width) * 100));
        const y = Math.max(0, Math.min(100, ((event.clientY - top) / height) * 100));
        setOrigin({ x, y });
    }, []);

    const hoverZoom = canHoverZoom();

    return (
        <div
            ref={containerRef}
            className={cn('image-zoom-inspect', active && 'image-zoom-inspect--active', className)}
            onMouseEnter={() => hoverZoom && setActive(true)}
            onMouseLeave={() => {
                setActive(false);
                setOrigin({ x: 50, y: 50 });
            }}
            onMouseMove={handleMove}
        >
            <img
                src={src}
                alt={alt}
                loading="lazy"
                draggable={false}
                className={cn('image-zoom-inspect__img', imgClassName)}
                style={
                    active && hoverZoom
                        ? {
                            transform: `scale(${zoom})`,
                            transformOrigin: `${origin.x}% ${origin.y}%`,
                        }
                        : undefined
                }
            />
        </div>
    );
}
