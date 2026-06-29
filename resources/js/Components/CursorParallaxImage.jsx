import { useRef, useState } from 'react';

export default function CursorParallaxImage({
    src,
    fallbackSrc,
    alt,
    className = '',
    intensity = 14,
}) {
    const frameRef = useRef(null);
    const [imageSrc, setImageSrc] = useState(src);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handleMove = (event) => {
        const rect = frameRef.current?.getBoundingClientRect();
        if (!rect) {
            return;
        }

        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        setOffset({
            x: x * intensity,
            y: y * intensity,
        });
    };

    const handleLeave = () => {
        setOffset({ x: 0, y: 0 });
    };

    return (
        <div
            ref={frameRef}
            className={`cursor-parallax ${className}`}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
        >
            <img
                src={imageSrc}
                alt={alt}
                loading="lazy"
                className="cursor-parallax__img"
                style={{
                    transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(1.06)`,
                }}
                onError={() => {
                    if (fallbackSrc && imageSrc !== fallbackSrc) {
                        setImageSrc(fallbackSrc);
                    }
                }}
            />
        </div>
    );
}
