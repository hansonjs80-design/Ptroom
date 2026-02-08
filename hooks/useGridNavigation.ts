import { useState, useCallback, useEffect, RefObject } from 'react';

interface UseGridNavigationOptions {
    rows: number;
    cols: number;
    onSelect: (row: number, col: number) => void;
    active?: boolean;
    containerRef?: RefObject<HTMLElement>;
    onExitTop?: () => void;
    onExitBottom?: () => void;
}

/**
 * Grid navigation hook for 2D navigation with arrow keys
 * Supports left/right/up/down arrows with proper grid wrapping
 */
export const useGridNavigation = ({
    rows,
    cols,
    onSelect,
    active = true,
    containerRef,
    onExitTop,
    onExitBottom
}: UseGridNavigationOptions) => {
    const [selectedRow, setSelectedRow] = useState(0);
    const [selectedCol, setSelectedCol] = useState(0);
    const totalItems = rows * cols;

    // Reset on activation
    useEffect(() => {
        if (active) {
            setSelectedRow(0);
            setSelectedCol(0);
        }
    }, [active]);

    // Auto-scroll into view
    useEffect(() => {
        if (!active || !containerRef?.current) return;

        const container = containerRef.current;
        const items = container.querySelectorAll('[data-grid-item]');
        const itemIndex = selectedRow * cols + selectedCol;
        const targetItem = items[itemIndex] as HTMLElement;

        if (targetItem) {
            targetItem.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    }, [selectedRow, selectedCol, active, containerRef, cols]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!active || totalItems === 0) return;

        const currentIndex = selectedRow * cols + selectedCol;

        switch (e.key) {
            case 'ArrowRight':
                e.preventDefault();
                if (selectedCol < cols - 1 && currentIndex + 1 < totalItems) {
                    setSelectedCol(prev => prev + 1);
                } else if (selectedRow < rows - 1) {
                    // Move to next row start
                    setSelectedRow(prev => prev + 1);
                    setSelectedCol(0);
                }
                break;

            case 'ArrowLeft':
                e.preventDefault();
                if (selectedCol > 0) {
                    setSelectedCol(prev => prev - 1);
                } else if (selectedRow > 0) {
                    // Move to previous row end
                    setSelectedRow(prev => prev - 1);
                    const prevRowLastCol = Math.min(cols - 1, totalItems - (selectedRow - 1) * cols - 1);
                    setSelectedCol(prevRowLastCol);
                }
                break;

            case 'ArrowDown':
                e.preventDefault();
                if (selectedRow < rows - 1) {
                    const nextRowIndex = (selectedRow + 1) * cols + selectedCol;
                    if (nextRowIndex < totalItems) {
                        setSelectedRow(prev => prev + 1);
                    } else {
                        // Last row doesn't have this column, go to last item
                        setSelectedRow(rows - 1);
                        setSelectedCol((totalItems - 1) % cols);
                    }
                } else if (onExitBottom) {
                    onExitBottom();
                }
                break;

            case 'ArrowUp':
                e.preventDefault();
                if (selectedRow > 0) {
                    setSelectedRow(prev => prev - 1);
                } else if (onExitTop) {
                    onExitTop();
                }
                break;

            case 'Enter':
                e.preventDefault();
                onSelect(selectedRow, selectedCol);
                break;
        }
    }, [active, rows, cols, selectedRow, selectedCol, totalItems, onSelect, onExitTop, onExitBottom]);

    useEffect(() => {
        if (active) {
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [active, handleKeyDown]);

    return {
        selectedRow,
        selectedCol,
        selectedIndex: selectedRow * cols + selectedCol,
        setPosition: (row: number, col: number) => {
            setSelectedRow(row);
            setSelectedCol(col);
        }
    };
};
