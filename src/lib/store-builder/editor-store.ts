'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type ElementType = 'body' | 'container' | 'header-nav' | 'hero-banner' | 'text-section' | 'product-grid' | 'footer' | 'text' | 'button' | 'image' | 'video' | 'contact-form' | 'two-column';

interface EditorElement {
  id: string;
  type: ElementType;
  name: string;
  styles: Record<string, any>;
  content: EditorElement[] | Record<string, any>; // Array for recursive, object for static
}

interface EditorState {
  editor: {
    elements: EditorElement[];
    selectedElement: string | null;
  };
  history: {
    elements: EditorElement[];
  }[];
  historyIndex: number;
  device: 'desktop' | 'tablet' | 'mobile';
  previewMode: boolean;
}

interface EditorActions {
  addElement: (element: EditorElement, containerId?: string) => void;
  updateElement: (id: string, updates: Partial<EditorElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  undo: () => void;
  redo: () => void;
  setDevice: (device: EditorState['device']) => void;
  setPreviewMode: (preview: boolean) => void;
  moveElement: (dragIndex: number, hoverIndex: number) => void;
}

const defaultBodyElement: EditorElement = {
  id: 'body',
  type: 'body',
  name: 'Body',
  styles: {},
  content: []
};

export const useEditorStore = create<EditorState & EditorActions>()(
  devtools((set, get) => ({
    editor: {
      elements: [defaultBodyElement],
      selectedElement: null
    },
    history: [{ elements: [defaultBodyElement] }],
    historyIndex: 0,
    device: 'desktop',
    previewMode: false,

    addElement: (element, containerId) => {
      set((state) => {
        const newElements = [...state.editor.elements];

        if (containerId) {
          const addToContainer = (elements: EditorElement[]): EditorElement[] => {
            return elements.map(el => {
              if (el.id === containerId && Array.isArray(el.content)) {
                return { ...el, content: [...el.content, element] };
              }
              if (Array.isArray(el.content)) {
                return { ...el, content: addToContainer(el.content) };
              }
              return el;
            });
          };
          const updatedElements = addToContainer(newElements);

          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push({ elements: updatedElements });

          return {
            editor: { ...state.editor, elements: updatedElements },
            history: newHistory,
            historyIndex: newHistory.length - 1
          };
        } else {
          newElements.push(element);

          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push({ elements: newElements });

          return {
            editor: { ...state.editor, elements: newElements },
            history: newHistory,
            historyIndex: newHistory.length - 1
          };
        }
      });
    },

    updateElement: (id, updates) => {
      set((state) => {
        const updateInElements = (elements: EditorElement[]): EditorElement[] => {
          return elements.map(el => {
            if (el.id === id) {
              return { ...el, ...updates };
            }
            if (Array.isArray(el.content)) {
              return { ...el, content: updateInElements(el.content) };
            }
            return el;
          });
        };

        const updatedElements = updateInElements(state.editor.elements);

        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push({ elements: updatedElements });

        return {
          editor: { ...state.editor, elements: updatedElements },
          history: newHistory,
          historyIndex: newHistory.length - 1
        };
      });
    },

    deleteElement: (id) => {
      set((state) => {
        const deleteFromElements = (elements: EditorElement[]): EditorElement[] => {
          return elements.filter(el => el.id !== id).map(el => {
            if (Array.isArray(el.content)) {
              return { ...el, content: deleteFromElements(el.content) };
            }
            return el;
          });
        };

        const updatedElements = deleteFromElements(state.editor.elements);

        return {
          editor: {
            elements: updatedElements,
            selectedElement: state.editor.selectedElement === id ? null : state.editor.selectedElement
          }
        };
      });
    },

    selectElement: (id) => set((state) => ({
      editor: { ...state.editor, selectedElement: id }
    })),

    undo: () => {
      set((state) => {
        if (state.historyIndex > 0) {
          const newIndex = state.historyIndex - 1;
          return {
            editor: { ...state.editor, elements: state.history[newIndex].elements },
            historyIndex: newIndex
          };
        }
        return state;
      });
    },

    redo: () => {
      set((state) => {
        if (state.historyIndex < state.history.length - 1) {
          const newIndex = state.historyIndex + 1;
          return {
            editor: { ...state.editor, elements: state.history[newIndex].elements },
            historyIndex: newIndex
          };
        }
        return state;
      });
    },

    setDevice: (device) => set({ device }),
    setPreviewMode: (previewMode) => set({ previewMode }),
    moveElement: (dragIndex, hoverIndex) => {
      set((state) => {
        const newElements = [...state.editor.elements];
        const draggedElement = newElements[dragIndex];
        newElements.splice(dragIndex, 1);
        newElements.splice(hoverIndex, 0, draggedElement);

        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push({ elements: newElements });

        return {
          editor: { ...state.editor, elements: newElements },
          history: newHistory,
          historyIndex: newHistory.length - 1
        };
      });
    }
  }))
);