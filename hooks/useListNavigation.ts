
import { useState, useCallback, useEffect, RefObject } from 'react';

interface UseListNavigationOptions {
    itemCount: number;
    onSelect: (index: number) => void;
    onEnter?: (index: number) => void;
    initialIndex?: number;
    loop?: boolean;
    active?: boolean;
    columnsPerRow?: number; // For grid navigation (left/right arrows)
    containerRef?: RefObject<HTMLElement>; // For auto-scrolling
}

export const useListNavigation = ({
    itemCount,
    onSelect,
    onEnter,
    initialIndex = 0,
    loop = true,
    active = true,
    columnsPerRow = 1,
    containerRef
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
            setSelectedIndex(prev => {
                const next = prev + columnsPerRow;
                if (next >= itemCount) return loop ? (prev % columnsPerRow) : prev;
                return next;
            });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => {
                const next = prev - columnsPerRow;
                if (next < 0) {
                    if (!loop) return prev;
                    // Jump to last row, same column
                    const col = prev % columnsPerRow;
                    const lastRowStart = Math.floor((itemCount - 1) / columnsPerRow) * columnsPerRow;
                    const lastRowIndex = lastRowStart + col;
                    return lastRowIndex < itemCount ? lastRowIndex : itemCount - 1;
                }
                return next;
            });
        } else if (e.key === 'ArrowRight' && columnsPerRow > 1) {
            e.preventDefault();
            setSelectedIndex(prev => {
                const next = prev + 1;
                if (next >= itemCount) return loop ? 0 : prev;
                return next;
            });
        } else if (e.key === 'ArrowLeft' && columnsPerRow > 1) {
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
    }, [active, itemCount, loop, selectedIndex, onSelect, onEnter, columnsPerRow]);

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
