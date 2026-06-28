import { useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { useToast } from '@/Components/ui/use-toast';

export default function FlashListener() {
    const { flash } = usePage().props;
    const { toast } = useToast();
    const lastShown = useRef({ success: null, error: null });

    useEffect(() => {
        if (flash?.success && flash.success !== lastShown.current.success) {
            lastShown.current.success = flash.success;
            toast({ title: 'Succès', description: flash.success, variant: 'success' });
        }
        if (flash?.error && flash.error !== lastShown.current.error) {
            lastShown.current.error = flash.error;
            toast({ title: 'Erreur', description: flash.error, variant: 'destructive' });
        }
    }, [flash?.success, flash?.error, toast]);

    return null;
}
