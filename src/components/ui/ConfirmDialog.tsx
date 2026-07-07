import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  danger = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      onClick={onCancel}
    >
      <div
        className="card w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${danger ? 'bg-red-50 text-red-500 dark:bg-red-500/10' : 'bg-matcha-50 text-matcha-600 dark:bg-matcha-900/40'}`}>
            <AlertTriangle className="h-5 w-5" />
          </div>
          <button onClick={onCancel} aria-label="Close" className="text-muted hover:text-current">
            <X className="h-5 w-5" />
          </button>
        </div>
        <h2 id="confirm-dialog-title" className="mt-4 text-lg font-semibold">
          {title}
        </h2>
        <p className="mt-1.5 text-sm text-muted">{description}</p>
        <div className="mt-6 flex gap-3">
          <button onClick={onCancel} className="btn-secondary flex-1">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-white transition active:scale-[0.98] ${
              danger ? 'bg-red-500 hover:bg-red-600' : 'bg-matcha-500 hover:bg-matcha-600'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
