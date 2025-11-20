'use client';

import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface EditorElement {
  id: string;
  type: string;
  name: string;
  styles: Record<string, any>;
  content: EditorElement[] | Record<string, any>;
  locked?: boolean;
  hidden?: boolean;
  animations?: Record<string, any>;
  responsive?: {
    desktop?: Record<string, any>;
    tablet?: Record<string, any>;
    mobile?: Record<string, any>;
  };
}

interface EditorState {
  editor: {
    elements: EditorElement[];
    selectedElement: string | null;
    multiSelection: string[];
    clipboard: EditorElement[];
  };
  history: { elements: EditorElement[]; timestamp: number }[];
  historyIndex: number;
  device: 'desktop' | 'tablet' | 'mobile';
  previewMode: boolean;
  zoom: number;
  grid: { enabled: boolean; size: number };
  rulers: boolean;
  performance: {
    renderTime: number;
    elementCount: number;
  };
}

interface EditorActions {
  // Element operations
  addElement: (element: EditorElement, containerId?: string, index?: number) => void;
  updateElement: (id: string, updates: Partial<EditorElement>) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  moveElement: (id: string, targetId: string, position: 'before' | 'after' | 'inside') => void;

  // Selection
  selectElement: (id: string | null, multi?: boolean) => void;
  selectMultiple: (ids: string[]) => void;
  clearSelection: () => void;

  // Clipboard
  copyElements: (ids: string[]) => void;
  pasteElements: (containerId?: string) => void;

  // History
  undo: () => void;
  redo: () => void;
  saveSnapshot: () => void;

  // View
  setDevice: (device: EditorState['device']) => void;
  setZoom: (zoom: number) => void;
  toggleGrid: () => void;
  toggleRulers: () => void;
  setPreviewMode: (preview: boolean) => void;

  // Performance
  updatePerformance: (metrics: Partial<EditorState['performance']>) => void;
}

const defaultBodyElement: EditorElement = {
  id: 'body',
  type: 'body',
  name: 'Body',
  styles: { minHeight: '100vh', backgroundColor: '#ffffff' },
  content: []
};

export const useEnterpriseStore = create<EditorState & EditorActions>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          editor: {
            elements: [defaultBodyElement],
            selectedElement: null,
            multiSelection: [],
            clipboard: []
          },
          history: [{ elements: [defaultBodyElement], timestamp: Date.now() }],
          historyIndex: 0,
          device: 'desktop',
          previewMode: false,
          zoom: 100,
          grid: { enabled: false, size: 20 },
          rulers: false,
          performance: { renderTime: 0, elementCount: 1 },

          addElement: (element, containerId, index) => set((state) => {
            const addToContainer = (elements: EditorElement[]): EditorElement[] => {
              return elements.map(el => {
                if (el.id === containerId && Array.isArray(el.content)) {
                  const newContent = [...el.content];
                  if (typeof index === 'number') {
                    newContent.splice(index, 0, element);
                  } else {
                    newContent.push(element);
                  }
                  return { ...el, content: newContent };
                }
                if (Array.isArray(el.content)) {
                  return { ...el, content: addToContainer(el.content) };
                }
                return el;
              });
            };

            const newElements = containerId ?
              addToContainer(state.editor.elements) :
              [...state.editor.elements, element];

            state.editor.elements = newElements;
            state.performance.elementCount = countElements(newElements);

            const newHistory = state.history.slice(0, state.historyIndex + 1);
            newHistory.push({ elements: newElements, timestamp: Date.now() });
            state.history = newHistory;
            state.historyIndex = newHistory.length - 1;
          }),

          updateElement: (id, updates) => set((state) => {
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

            state.editor.elements = updateInElements(state.editor.elements);

            const newHistory = state.history.slice(0, state.historyIndex + 1);
            newHistory.push({ elements: state.editor.elements, timestamp: Date.now() });
            state.history = newHistory;
            state.historyIndex = newHistory.length - 1;
          }),

          deleteElement: (id) => set((state) => {
            const deleteFromElements = (elements: EditorElement[]): EditorElement[] => {
              return elements.filter(el => el.id !== id).map(el => {
                if (Array.isArray(el.content)) {
                  return { ...el, content: deleteFromElements(el.content) };
                }
                return el;
              });
            };

            state.editor.elements = deleteFromElements(state.editor.elements);
            state.editor.selectedElement = state.editor.selectedElement === id ? null : state.editor.selectedElement;
            state.editor.multiSelection = state.editor.multiSelection.filter(selId => selId !== id);
            state.performance.elementCount = countElements(state.editor.elements);
          }),

          duplicateElement: (id) => set((state) => {
            const findAndDuplicate = (elements: EditorElement[]): EditorElement[] => {
              return elements.flatMap(el => {
                if (el.id === id) {
                  const duplicate = { ...el, id: `${el.type}-${Date.now()}`, name: `${el.name} Copy` };
                  return [el, duplicate];
                }
                if (Array.isArray(el.content)) {
                  return [{ ...el, content: findAndDuplicate(el.content) }];
                }
                return [el];
              });
            };

            state.editor.elements = findAndDuplicate(state.editor.elements);
          }),

          moveElement: (id, targetId, position) => set((state) => {
            let movedElement: EditorElement | null = null;

            // 1. Find and remove the element
            const removeRecursive = (elements: EditorElement[]): EditorElement[] => {
              // Check if element is in this level
              const index = elements.findIndex(el => el.id === id);
              if (index !== -1) {
                movedElement = elements[index];
                return elements.filter(el => el.id !== id);
              }

              // Recurse
              return elements.map(el => {
                if (Array.isArray(el.content)) {
                  return { ...el, content: removeRecursive(el.content) };
                }
                return el;
              });
            };

            const elementsWithoutMoved = removeRecursive(state.editor.elements);

            if (!movedElement) return;

            // 2. Insert the element at new position
            const insertRecursive = (elements: EditorElement[]): EditorElement[] => {
              // Handle 'inside' position
              if (position === 'inside') {
                return elements.map(el => {
                  if (el.id === targetId && Array.isArray(el.content)) {
                    return { ...el, content: [...el.content, movedElement!] };
                  }
                  if (Array.isArray(el.content)) {
                    return { ...el, content: insertRecursive(el.content) };
                  }
                  return el;
                });
              }

              // Handle 'before' or 'after' position
              const targetIndex = elements.findIndex(el => el.id === targetId);
              if (targetIndex !== -1) {
                const newArr = [...elements];
                const insertIndex = position === 'before' ? targetIndex : targetIndex + 1;
                newArr.splice(insertIndex, 0, movedElement!);
                return newArr;
              }

              // Recurse
              return elements.map(el => {
                if (Array.isArray(el.content)) {
                  return { ...el, content: insertRecursive(el.content) };
                }
                return el;
              });
            };

            state.editor.elements = insertRecursive(elementsWithoutMoved);

            // Update history
            const newHistory = state.history.slice(0, state.historyIndex + 1);
            newHistory.push({ elements: state.editor.elements, timestamp: Date.now() });
            state.history = newHistory;
            state.historyIndex = newHistory.length - 1;
          }),

          selectElement: (id, multi = false) => set((state) => {
            if (multi && id) {
              if (state.editor.multiSelection.includes(id)) {
                state.editor.multiSelection = state.editor.multiSelection.filter(selId => selId !== id);
              } else {
                state.editor.multiSelection.push(id);
              }
            } else {
              state.editor.selectedElement = id;
              state.editor.multiSelection = [];
            }
          }),

          selectMultiple: (ids) => set((state) => {
            state.editor.multiSelection = ids;
            state.editor.selectedElement = null;
          }),

          clearSelection: () => set((state) => {
            state.editor.selectedElement = null;
            state.editor.multiSelection = [];
          }),

          copyElements: (ids) => set((state) => {
            const findElements = (elements: EditorElement[], targetIds: string[]): EditorElement[] => {
              const found: EditorElement[] = [];
              elements.forEach(el => {
                if (targetIds.includes(el.id)) {
                  found.push(el);
                }
                if (Array.isArray(el.content)) {
                  found.push(...findElements(el.content, targetIds));
                }
              });
              return found;
            };

            state.editor.clipboard = findElements(state.editor.elements, ids);
          }),

          pasteElements: (containerId) => set((state) => {
            state.editor.clipboard.forEach(element => {
              const newElement = {
                ...element,
                id: `${element.type}-${Date.now()}-${Math.random()}`,
                name: `${element.name} Copy`
              };
              // Add logic to paste elements
            });
          }),

          undo: () => set((state) => {
            if (state.historyIndex > 0) {
              state.historyIndex--;
              state.editor.elements = state.history[state.historyIndex].elements;
            }
          }),

          redo: () => set((state) => {
            if (state.historyIndex < state.history.length - 1) {
              state.historyIndex++;
              state.editor.elements = state.history[state.historyIndex].elements;
            }
          }),

          saveSnapshot: () => set((state) => {
            const newHistory = state.history.slice(0, state.historyIndex + 1);
            newHistory.push({ elements: state.editor.elements, timestamp: Date.now() });
            state.history = newHistory;
            state.historyIndex = newHistory.length - 1;
          }),

          setDevice: (device) => set((state) => { state.device = device; }),
          setZoom: (zoom) => set((state) => { state.zoom = Math.max(25, Math.min(200, zoom)); }),
          toggleGrid: () => set((state) => { state.grid.enabled = !state.grid.enabled; }),
          toggleRulers: () => set((state) => { state.rulers = !state.rulers; }),
          setPreviewMode: (preview) => set((state) => { state.previewMode = preview; }),

          updatePerformance: (metrics) => set((state) => {
            Object.assign(state.performance, metrics);
          })
        }))
      ),
      { name: 'enterprise-store-builder' }
    )
  )
);

function countElements(elements: EditorElement[]): number {
  return elements.reduce((count, el) => {
    return count + 1 + (Array.isArray(el.content) ? countElements(el.content) : 0);
  }, 0);
}