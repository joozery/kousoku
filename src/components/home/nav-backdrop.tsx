'use client';

export function NavBackdrop({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      aria-hidden
      onClick={onClose}
      className={`fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm transition-opacity duration-200 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    />
  );
}
