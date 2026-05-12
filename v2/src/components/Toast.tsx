import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";
import { useToast, type ToastType, type ToastMessage } from "../context/ToastContext";

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="size-5 text-green-500 shrink-0" />,
  error: <XCircle className="size-5 text-red-500 shrink-0" />,
  warning: <AlertTriangle className="size-5 text-amber-500 shrink-0" />,
  info: <Info className="size-5 text-blue-500 shrink-0" />,
};

const borders: Record<ToastType, string> = {
  success: "border-green-200 bg-green-50",
  error: "border-red-200 bg-red-50",
  warning: "border-amber-200 bg-amber-50",
  info: "border-blue-200 bg-blue-50",
};

function ToastItem({ toast }: { toast: ToastMessage }) {
  const { removeToast } = useToast();
  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-lg border shadow-lg text-sm font-medium text-gray-800 toast-slide-in ${borders[toast.type]}`}
    >
      {icons[toast.type]}
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => removeToast(toast.id)}
        className="text-gray-400 hover:text-gray-600 transition-colors ml-1"
        aria-label="Dismiss"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

export function Toaster() {
  const { toasts } = useToast();
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 w-80">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}
