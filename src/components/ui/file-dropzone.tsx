import { Upload } from "lucide-react";
import React, { RefObject } from "react";

interface FileDropzoneProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleBoxClick: () => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileSelect: (files: FileList | null) => void;
  multiple?: boolean;
}

export function FileDropzone({
  fileInputRef,
  handleBoxClick,
  handleDragOver,
  handleDrop,
  handleFileSelect,
  multiple = true,
}: FileDropzoneProps) {
  return (
    <div className="px-6">
      <div
        className="border-2 border-dashed border-border rounded-md p-8 flex flex-col items-center justify-center text-center cursor-pointer"
        onClick={handleBoxClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="mb-2 bg-muted rounded-full p-3">
          <Upload className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">
          Drag and drop or choose image
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          PNG, JPG or WebP (4MB max)
        </p>
        <input
          type="file"
          id="fileUpload"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
        />
      </div>
    </div>
  );
}