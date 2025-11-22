"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AddProductSheet } from "./_components/add-product-sheet";

export function AddProductButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Product
      </Button>

      <AddProductSheet
        open={isOpen}
        onOpenChange={setIsOpen}
        onSuccess={() => {
          // Optionally refresh or show success
        }}
      />
    </>
  );
}
