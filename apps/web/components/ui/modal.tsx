"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import type * as React from "react";

import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <section
        aria-describedby={description ? "modal-description" : undefined}
        aria-labelledby="modal-title"
        aria-modal="true"
        className={cn("surface w-full max-w-md p-6", className)}
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="modal-title" className="text-xl font-semibold">
              {title}
            </h2>
            {description ? (
              <p
                id="modal-description"
                className="mt-1 text-sm text-muted-foreground"
              >
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            aria-label="Close dialog"
            className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </section>
    </div>
  );
}
