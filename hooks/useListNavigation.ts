
import { useState, useCallback, useEffect } from 'react';

interface UseListNavigationOptions {
    itemCount: number;
    onSelect: (index: number) => void;
    onEnter?: (index: number) => void;
    initialIndex?: number;
    loop?: boolean;
    active?: boolean;
}

export const useListNavigation = ({
    itemCount,
    onSelect,
    onEnter,
    initialIndex = 0,
    loop = true,
    active = true
}: UseListNavigationOptions) => {
    const [selectedIndex, setSelectedIndex] = useState(initialIndex);

    useEffect(() => {
        if (active) {
            setSelectedIndex(initialIndex);
        }
    }, [active, initialIndex]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!active || itemCount === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => {
                const next = prev + 1;
                if (next >= itemCount) return loop ? 0 : prev;
                return next;
            });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => {
                const next = prev - 1;
                if (next < 0) return loop ? itemCount - 1 : prev;
                return next;
            });
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (onEnter) {
                onEnter(selectedIndex);
            } else {
                onSelect(selectedIndex);
            }
        }
    }, [active, itemCount, loop, selectedIndex, onSelect, onEnter]);

    useEffect(() => {
        if (active) {
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [active, handleKeyDown]);

    return {
        selectedIndex,
        setSelectedIndex
    };
};
