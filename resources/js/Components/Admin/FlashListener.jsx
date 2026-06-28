import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { useToast } from '@/Components/ui/use-toast';

export default function FlashListener() {
    const { flash } = usePage().props;
    const { toast } = useToast();

    useEffect(() => {
        if (flash?.success) {
            toast({ title: 'Succès', description: flash.success, variant: 'success' });
        }
        if (flash?.error) {
            toast({ title: 'Erreur', description: flash.error, variant: 'destructive' });
        }
    }, [flash?.success, flash?.error, toast]);

    return null;
}
