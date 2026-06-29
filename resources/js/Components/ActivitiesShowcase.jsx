import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const cardAccents = ['blue', 'teal', 'navy', 'red', 'green'];

export default function ActivitiesShowcase({ lines, icons }) {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    const glowX = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

    if (!lines?.length) {
        return null;
    }

    return (
        <div ref={containerRef} className="activities-showcase">
            <motion.div
                className="activities-showcase__glow"
                style={{ x: glowX }}
                aria-hidden="true"
            />

            <div className="activities-showcase__timeline">
                {lines.map((line, index) => {
                    const Icon = icons[index % icons.length];
                    const accent = cardAccents[index % cardAccents.length];
                    const isLast = index === lines.length - 1;

                    return (
                        <motion.div
                            key={line}
                            className="activities-showcase__row"
                            initial={{ opacity: 0, x: index % 2 === 0 ? -24 : 24 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.35 }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.07,
                                ease: [0.32, 0.72, 0, 1],
                            }}
                        >
                            <div className="activities-showcase__rail" aria-hidden="true">
                                <span className={`activities-showcase__dot activities-showcase__dot--${accent}`}>
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                {!isLast && <span className="activities-showcase__line" />}
                            </div>

                            <motion.article
                                className={`activities-showcase__card activities-showcase__card--${accent}`}
                                whileHover={{ y: -4, scale: 1.01 }}
                                transition={{ duration: 0.22 }}
                            >
                                <div className="activities-showcase__card-head">
                                    <div className="activities-showcase__icon">
                                        <Icon className="h-5 w-5" aria-hidden="true" />
                                    </div>
                                    <span className="activities-showcase__tag">Activité {index + 1}</span>
                                </div>
                                <p className="activities-showcase__label">{line}</p>
                            </motion.article>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
