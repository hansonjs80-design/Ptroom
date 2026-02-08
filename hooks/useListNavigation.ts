
import { useState, useCallback, useEffect, RefObject } from 'react';

interface UseListNavigationOptions {
    itemCount: number;
    onSelect: (index: number) => void;
    onEnter?: (index: number) => void;
    initialIndex?: number;
    loop?: boolean;
    active?: boolean;
    containerRef?: RefObject<HTMLElement>;
    onExitBottom?: () => void; // Callback when trying to go past the last item
}

/**
 * 1D List navigation hook for vertical navigation with up/down arrows
 */
export const useListNavigation = ({
    itemCount,
    onSelect,
    onEnter,
    initialIndex = 0,
    loop = false, // Changed default to false for better UX
    active = true,
    containerRef,
    onExitBottom
}: UseListNavigationOptions) => {
    const [selectedIndex, setSelectedIndex] = useState(initialIndex);

    useEffect(() => {
        if (active) {
            setSelectedIndex(initialIndex);
        }
    }, [active, initialIndex]);

    // Auto-scroll into view when selectedIndex changes
    useEffect(() => {
        if (!active || !containerRef?.current) return;

        const container = containerRef.current;
        const items = container.querySelectorAll('[data-nav-item]');
        const targetItem = items[selectedIndex] as HTMLElement;

        if (targetItem) {
            targetItem.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    }, [selectedIndex, active, containerRef]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!active || itemCount === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (selectedIndex < itemCount - 1) {
                setSelectedIndex(prev => prev + 1);
            } else if (onExitBottom) {
                onExitBottom();
            } else if (loop) {
                setSelectedIndex(0);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (selectedIndex > 0) {
                setSelectedIndex(prev => prev - 1);
            } else if (loop) {
                setSelectedIndex(itemCount - 1);
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (onEnter) {
                onEnter(selectedIndex);
            } else {
                onSelect(selectedIndex);
            }
        }
    }, [active, itemCount, loop, selectedIndex, onSelect, onEnter, onExitBottom]);

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
