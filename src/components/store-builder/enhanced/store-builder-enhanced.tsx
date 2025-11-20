'use client';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { StoreBuilderHeader } from './header';
import { LeftPanel } from './left-panel';
import { CanvasArea } from './canvas-area';
import { RightPanel } from './right-panel';
import { useStoreBuilder } from '@/lib/store-builder/store';

export function StoreBuilderEnhanced() {
  const { isLeftPanelCollapsed, isRightPanelCollapsed } = useStoreBuilder();

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        {/* Header */}
        <StoreBuilderHeader />

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden gap-1 p-1">
          {/* Left Panel */}
          <div className="rounded-lg overflow-hidden shadow-sm">
            <LeftPanel />
          </div>

          {/* Canvas Area */}
          <div className="flex-1 rounded-lg overflow-hidden shadow-sm">
            <CanvasArea />
          </div>

          {/* Right Panel */}
          <div className="rounded-lg overflow-hidden shadow-sm">
            <RightPanel />
          </div>
        </div>
      </div>
    </DndProvider>
  );
}