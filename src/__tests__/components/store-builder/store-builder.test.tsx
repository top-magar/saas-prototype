import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { StoreBuilder } from '../../../components/store-builder/store-builder';

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};

// Mock sonner toast
jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
    },
}));

// Mock react-dnd to avoid ESM issues
jest.mock('react-dnd', () => ({
    DndProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useDrag: () => [{ isDragging: false }, jest.fn(), jest.fn()],
    useDrop: () => [{ isOver: false }, jest.fn()],
}));

jest.mock('react-dnd-html5-backend', () => ({
    HTML5Backend: {},
}));

describe('StoreBuilder', () => {
    it('renders without crashing', () => {
        render(<StoreBuilder />);
        expect(screen.getByText('Store Builder')).toBeInTheDocument();
    });

    it('adds a component when clicked in library', async () => {
        render(<StoreBuilder />);

        // Switch to Components tab (it is default, but good to be sure)
        const componentsTab = screen.getByText('Components');
        fireEvent.click(componentsTab);

        // Find a component to add, e.g., "Header Navigation"
        // The text might be split or in a child, so we look for "Header Navigation"
        const headerNav = screen.getByText('Header Navigation');

        // Click it
        await act(async () => {
            fireEvent.click(headerNav);
        });

        // Check if it appears in the canvas
        // The canvas renders the component. Header Navigation usually has "Home", "Products" links.
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('supports undo and redo', async () => {
        const { container } = render(<StoreBuilder />);

        // Add a component
        const headerNav = screen.getByText('Header Navigation');
        await act(async () => {
            fireEvent.click(headerNav);
        });

        expect(screen.getByText('Home')).toBeInTheDocument();

        // Click Undo
        // Find Undo button by icon class
        const undoIcon = container.querySelector('.lucide-undo');
        const undoButton = undoIcon?.closest('button');

        expect(undoButton).toBeEnabled();

        await act(async () => {
            fireEvent.click(undoButton!);
        });

        // Component should be gone
        expect(screen.queryByText('Home')).not.toBeInTheDocument();

        // Redo
        const redoIcon = container.querySelector('.lucide-redo');
        const redoButton = redoIcon?.closest('button');

        expect(redoButton).toBeEnabled();

        await act(async () => {
            fireEvent.click(redoButton!);
        });

        // Component should be back
        expect(screen.getByText('Home')).toBeInTheDocument();
    });
});
