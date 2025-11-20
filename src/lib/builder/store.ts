'use client';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Element {
  id: string;
  type: string;
  props: Record<string, any>;
  styles: Record<string, any>;
  children: Element[];
}

interface BuilderState {
  elements: Element[];
  selected: string | null;
  history: Element[][];
  historyIndex: number;
  device: 'desktop' | 'tablet' | 'mobile';
  zoom: number;
}

interface BuilderActions {
  addElement: (element: Element, parentId?: string) => void;
  updateElement: (id: string, updates: Partial<Element>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  undo: () => void;
  redo: () => void;
  setDevice: (device: BuilderState['device']) => void;
  setZoom: (zoom: number) => void;
}

const updateElementInTree = (elements: Element[], id: string, updates: Partial<Element>): Element[] => {
  return elements.map(element => {
    if (element.id === id) {
      return { ...element, ...updates };
    }
    return { ...element, children: updateElementInTree(element.children, id, updates) };
  });
};

const deleteElementFromTree = (elements: Element[], id: string): Element[] => {
  return elements.filter(element => element.id !== id).map(element => ({
    ...element,
    children: deleteElementFromTree(element.children, id)
  }));
};

const addElementToTree = (elements: Element[], element: Element, parentId?: string): Element[] => {
  if (!parentId) return [...elements, element];
  
  return elements.map(el => {
    if (el.id === parentId) {
      return { ...el, children: [...el.children, element] };
    }
    return { ...el, children: addElementToTree(el.children, element, parentId) };
  });
};

export const useBuilder = create<BuilderState & BuilderActions>()(
  devtools(
    persist(
      (set) => ({
        elements: [],
        selected: null,
        history: [[]],
        historyIndex: 0,
        device: 'desktop',
        zoom: 100,

        addElement: (element, parentId) => set(state => {
          const newElements = addElementToTree(state.elements, element, parentId);
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push(newElements);
          
          return {
            elements: newElements,
            history: newHistory,
            historyIndex: newHistory.length - 1
          };
        }),

        updateElement: (id, updates) => set(state => {
          const newElements = updateElementInTree(state.elements, id, updates);
          return { elements: newElements };
        }),

        deleteElement: (id) => set(state => ({
          elements: deleteElementFromTree(state.elements, id),
          selected: state.selected === id ? null : state.selected
        })),

        selectElement: (id) => set({ selected: id }),

        undo: () => set(state => {
          if (state.historyIndex > 0) {
            const newIndex = state.historyIndex - 1;
            return {
              elements: state.history[newIndex],
              historyIndex: newIndex
            };
          }
          return state;
        }),

        redo: () => set(state => {
          if (state.historyIndex < state.history.length - 1) {
            const newIndex = state.historyIndex + 1;
            return {
              elements: state.history[newIndex],
              historyIndex: newIndex
            };
          }
          return state;
        }),

        setDevice: (device) => set({ device }),
        setZoom: (zoom) => set({ zoom: Math.max(25, Math.min(200, zoom)) })
      }),
      { name: 'store-builder' }
    )
  )
);