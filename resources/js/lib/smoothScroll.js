/**
 * Smooth scroll with easing (more perceptible than native on some browsers).
 */
export function smoothScrollTo(targetY = 0, duration = 750) {
    const startY = window.scrollY;
    const distance = targetY - startY;

    if (Math.abs(distance) < 2) {
        return;
    }

    const startTime = performance.now();

    const easeOutCubic = (t) => 1 - (1 - t) ** 3;

    const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        window.scrollTo(0, startY + distance * easeOutCubic(progress));

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    };

    requestAnimationFrame(step);
}

export function smoothScrollToTop(duration = 750) {
    smoothScrollTo(0, duration);
}
