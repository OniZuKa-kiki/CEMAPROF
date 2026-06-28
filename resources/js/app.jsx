import "../css/app.css";
import "./bootstrap";
import { createInertiaApp, router } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { initLayoutShiftFix } from "@/lib/preventLayoutShift";
import { initScrollReveal } from "@/lib/scrollReveal";
import { ToastProvider } from "@/Components/ui/use-toast";
import { Toaster } from "@/Components/ui/toaster";

initLayoutShiftFix();

const appName = "CEMAPROF — La Centrale du Matériel Professionnel";

let reactRoot = null;

createInertiaApp({
    title: (title) => (title ? `${title} | CEMAPROF` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx"),
        ),
    setup({ el, App, props }) {
        reactRoot = reactRoot ?? createRoot(el);
        reactRoot.render(
            <ToastProvider>
                <App {...props} />
                <Toaster />
            </ToastProvider>,
        );
        requestAnimationFrame(() => initScrollReveal());
    },
    progress: {
        color: "#1A3FCB",
        showSpinner: true,
    },
});

router.on("navigate", () => {
    requestAnimationFrame(() => initScrollReveal());
});

// Fix blank page when using browser back (bfcache restores stale React state)
window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
        router.reload({ preserveScroll: true });
    }
});
