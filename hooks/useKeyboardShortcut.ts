import { useEffect } from 'react';

interface UseKeyboardShortcutProps {
    onEscape?: () => void;
    onEnter?: () => void;
    disableEnter?: boolean;
}

export const useKeyboardShortcut = ({ onEscape, onEnter, disableEnter = false }: UseKeyboardShortcutProps) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Escape Key
            if (e.key === 'Escape' && onEscape) {
                e.preventDefault();
                onEscape();
            }

            // Enter Key
            if (e.key === 'Enter' && onEnter && !disableEnter) {
                // If the active element is a button or input/textarea that handles Enter natively (e.g. multiline), 
                // we might want to be careful. But generally for modals, Global Enter usually means Confirm.
                // However, to avoid conflict with text inputs inside modals (where Enter might mean newline or just input submit),
                // we should check if we want to override.

                // Strategy: Allow default behavior if it's strictly focused on an element that needs Enter,
                // BUT "Confirm" actions usually override unless specifically prevented.
                // For now, let's treat it as a trigger.

                // Check if active element is a textarea to avoid premature submission
                const activeTag = document.activeElement?.tagName.toLowerCase();
                if (activeTag === 'textarea') return;

                e.preventDefault();
                onEnter();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onEscape, onEnter, disableEnter]);
};
