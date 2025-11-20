'use client';
import { useEffect, useRef } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';

interface WebsiteBuilderProps {
  onSave?: (html: string, css: string) => void;
  initialContent?: string;
}

export function WebsiteBuilder({ onSave, initialContent }: WebsiteBuilderProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<any>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    editorInstance.current = grapesjs.init({
      container: editorRef.current,
      height: '100vh',
      width: 'auto',
      storageManager: false,
      blockManager: {
        appendTo: '.blocks-container',
      },
      styleManager: {
        appendTo: '.styles-container',
      },
      layerManager: {
        appendTo: '.layers-container',
      },
      traitManager: {
        appendTo: '.traits-container',
      },
      selectorManager: {
        appendTo: '.selectors-container',
      },
      panels: {
        defaults: [
          {
            id: 'basic-actions',
            el: '.panel__basic-actions',
            buttons: [
              {
                id: 'visibility',
                active: true,
                className: 'btn-toggle-borders',
                label: '<i class="fa fa-clone"></i>',
                command: 'sw-visibility',
              },
              {
                id: 'export',
                className: 'btn-open-export',
                label: '<i class="fa fa-code"></i>',
                command: 'export-template',
                context: 'export-template',
              },
              {
                id: 'show-json',
                className: 'btn-show-json',
                label: '<i class="fa fa-download"></i>',
                context: 'show-json',
                command: () => {
                  if (onSave) {
                    const html = editorInstance.current.getHtml();
                    const css = editorInstance.current.getCss();
                    onSave(html, css);
                  }
                },
              },
            ],
          },
          {
            id: 'panel-devices',
            el: '.panel__devices',
            buttons: [
              {
                id: 'device-desktop',
                label: '<i class="fa fa-television"></i>',
                command: 'set-device-desktop',
                active: true,
                togglable: false,
              },
              {
                id: 'device-mobile',
                label: '<i class="fa fa-mobile"></i>',
                command: 'set-device-mobile',
                togglable: false,
              },
            ],
          },
        ],
      },
      deviceManager: {
        devices: [
          {
            name: 'Desktop',
            width: '',
          },
          {
            name: 'Mobile',
            width: '320px',
            widthMedia: '480px',
          },
        ],
      },
      plugins: ['gjs-preset-webpage'],
      pluginsOpts: {
        'gjs-preset-webpage': {
          modalImportTitle: 'Import Template',
          modalImportLabel: '<div style="margin-bottom: 10px; font-size: 13px;">Paste here your HTML/CSS and click Import</div>',
          modalImportContent: function(editor: any) {
            return editor.getHtml() + '<style>' + editor.getCss() + '</style>';
          },
        },
      },
    });

    // Load initial content if provided
    if (initialContent) {
      editorInstance.current.setComponents(initialContent);
    }

    // Add some default blocks
    const blockManager = editorInstance.current.BlockManager;
    blockManager.add('text-block', {
      label: 'Text',
      content: '<div class="text-block">Insert your text here</div>',
      category: 'Basic',
    });

    blockManager.add('image-block', {
      label: 'Image',
      content: '<img src="https://via.placeholder.com/300x200" alt="placeholder" />',
      category: 'Basic',
    });

    return () => {
      if (editorInstance.current) {
        editorInstance.current.destroy();
      }
    };
  }, [initialContent, onSave]);

  return (
    <div className="website-builder h-screen flex">
      <div className="flex-1 flex flex-col">
        <div className="panel__devices bg-gray-100 p-2 flex gap-2"></div>
        <div className="panel__basic-actions bg-gray-100 p-2 flex gap-2"></div>
        <div ref={editorRef} className="flex-1"></div>
      </div>
      <div className="w-64 bg-gray-50 border-l">
        <div className="blocks-container p-4">
          <h3 className="font-semibold mb-2">Blocks</h3>
        </div>
        <div className="styles-container p-4">
          <h3 className="font-semibold mb-2">Styles</h3>
        </div>
        <div className="traits-container p-4">
          <h3 className="font-semibold mb-2">Settings</h3>
        </div>
        <div className="layers-container p-4">
          <h3 className="font-semibold mb-2">Layers</h3>
        </div>
      </div>
    </div>
  );
}