import { useCallback, useEffect, useRef, useState } from 'react';

function formatPrice(value) {
    if (value == null || Number.isNaN(value)) {
        return '—';
    }

    return `${Number(value).toLocaleString('fr-MA')} DH`;
}

export default function PriceRangeSlider({ min, max, valueMin, valueMax, onChange, debounceMs = 400 }) {
    const [localMin, setLocalMin] = useState(valueMin ?? min);
    const [localMax, setLocalMax] = useState(valueMax ?? max);
    const timerRef = useRef(null);

    useEffect(() => {
        setLocalMin(valueMin ?? min);
        setLocalMax(valueMax ?? max);
    }, [valueMin, valueMax, min, max]);

    const emitChange = useCallback((nextMin, nextMax) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            onChange({
                price_min: nextMin <= min ? undefined : nextMin,
                price_max: nextMax >= max ? undefined : nextMax,
            });
        }, debounceMs);
    }, [min, max, onChange, debounceMs]);

    useEffect(() => () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
    }, []);

    if (min >= max) {
        return null;
    }

    const range = max - min;
    const leftPct = ((localMin - min) / range) * 100;
    const widthPct = ((localMax - localMin) / range) * 100;

    const handleMin = (event) => {
        const next = Math.min(Number(event.target.value), localMax - 1);
        setLocalMin(next);
        emitChange(next, localMax);
    };

    const handleMax = (event) => {
        const next = Math.max(Number(event.target.value), localMin + 1);
        setLocalMax(next);
        emitChange(localMin, next);
    };

    return (
        <div className="price-range-slider">
            <div className="price-range-slider__track-wrap">
                <div className="price-range-slider__track" />
                <div
                    className="price-range-slider__fill"
                    style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={localMin}
                    onChange={handleMin}
                    className="price-range-slider__input price-range-slider__input--min"
                    aria-label="Prix minimum"
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={localMax}
                    onChange={handleMax}
                    className="price-range-slider__input price-range-slider__input--max"
                    aria-label="Prix maximum"
                />
            </div>
            <p className="price-range-slider__label">
                Prix : <span>{formatPrice(localMin)} — {formatPrice(localMax)}</span>
            </p>
        </div>
    );
}
