import { useState, useEffect, createContext, useContext, useCallback } from 'react';

const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY = 5000;

let count = 0;
function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER;
    return count.toString();
}

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const dismiss = useCallback((toastId) => {
        setToasts((prev) => prev.map((t) => (t.id === toastId ? { ...t, open: false } : t)));
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== toastId));
        }, 300);
    }, []);

    const toast = useCallback(({ title, description, variant = 'default' }) => {
        const id = genId();
        setToasts((prev) => [{ id, title, description, variant, open: true }, ...prev].slice(0, TOAST_LIMIT));
        setTimeout(() => dismiss(id), TOAST_REMOVE_DELAY);
        return id;
    }, [dismiss]);

    return (
        <ToastContext.Provider value={{ toasts, toast, dismiss }}>
            {children}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}
