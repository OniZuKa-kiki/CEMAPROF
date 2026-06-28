const FIX_STYLE_ID = 'cemaprof-scroll-lock-override';

/**
 * Radix Select always mounts react-remove-scroll (modal prop is ignored in v2.3),
 * which injects body padding/margin and a fake scrollbar — visible as a white vertical bar.
 * This module neutralizes those artifacts and keeps a stable scrollbar gutter.
 */
export function initLayoutShiftFix() {
    if (typeof window === 'undefined') {
        return;
    }

    const ensureOverrideStyles = () => {
        let style = document.getElementById(FIX_STYLE_ID);

        if (!style) {
            style = document.createElement('style');
            style.id = FIX_STYLE_ID;
            document.head.appendChild(style);
        }

        // Appended last so it wins over react-remove-scroll's !important singleton.
        style.textContent = `
            body[data-scroll-locked],
            html[data-scroll-locked] {
                overflow-y: scroll !important;
                overflow-x: clip !important;
                margin-right: 0 !important;
                padding-right: 0 !important;
                --removed-body-scroll-bar-size: 0px !important;
            }

            [data-remove-scroll-bar] {
                display: none !important;
                width: 0 !important;
                max-width: 0 !important;
                visibility: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
            }

            .width-before-scroll-bar,
            .right-scroll-bar-position,
            .with-scroll-bars-hidden {
                margin-right: 0 !important;
                padding-right: 0 !important;
                right: 0 !important;
                width: auto !important;
            }
        `;

        if (style.parentNode?.lastChild !== style) {
            document.head.appendChild(style);
        }
    };

    const neutralizeScrollLockArtifacts = () => {
        ensureOverrideStyles();

        document.querySelectorAll('[data-remove-scroll-bar]').forEach((node) => {
            node.remove();
        });

        document.body.style.removeProperty('margin-right');
        document.body.style.removeProperty('padding-right');
        document.documentElement.style.removeProperty('margin-right');
        document.documentElement.style.removeProperty('padding-right');

        document.querySelectorAll('.width-before-scroll-bar, .right-scroll-bar-position, .with-scroll-bars-hidden').forEach((node) => {
            node.classList.remove('width-before-scroll-bar', 'right-scroll-bar-position', 'with-scroll-bars-hidden');
            node.style.removeProperty('right');
            node.style.removeProperty('margin-right');
            node.style.removeProperty('padding-right');
            node.style.removeProperty('width');
        });
    };

    const updateScrollbarWidth = () => {
        const width = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
        document.documentElement.style.setProperty('--scrollbar-width', `${width}px`);
    };

    updateScrollbarWidth();
    neutralizeScrollLockArtifacts();

    window.addEventListener('resize', () => {
        updateScrollbarWidth();
        neutralizeScrollLockArtifacts();
    }, { passive: true });

    const observer = new MutationObserver(() => {
        updateScrollbarWidth();
        neutralizeScrollLockArtifacts();
    });

    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['data-scroll-locked', 'style', 'class'],
        childList: true,
        subtree: true,
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['style', 'class', 'data-scroll-locked'],
        childList: true,
    });

    document.addEventListener('pointerdown', neutralizeScrollLockArtifacts, true);
    document.addEventListener('focusin', neutralizeScrollLockArtifacts, true);
}
