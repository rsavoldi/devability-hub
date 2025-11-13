"use client";

import { useEffect } from 'react';
import { errorEmitter, FirestorePermissionError } from './error-emitter';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
    const { toast } = useToast();

    useEffect(() => {
        const handleError = (error: FirestorePermissionError) => {
            console.error("Firestore Permission Error Captured:", error.message);
            toast({
                variant: 'destructive',
                title: "Erro de Permissão do Firestore",
                description: "Ocorreu um erro de permissão ao acessar o banco de dados. Verifique o console do desenvolvedor para mais detalhes.",
                duration: 9000,
            });
        };

        errorEmitter.on('permission-error', handleError);

        // Cleanup
        return () => {
            errorEmitter.off('permission-error', handleError);
        };
    }, [toast]);

    return null; // This component does not render anything
}
