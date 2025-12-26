import { useEffect } from 'react';
import useToastStore from '../store/toastStore';
import './Toast.css';

export default function Toast() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }) {
  useEffect(() => {
    if (toast.duration > 0) {
      const timer = setTimeout(onClose, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration, onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'close-circle';
      case 'warning':
        return 'warning';
      default:
        return 'information-circle';
    }
  };

  return (
    <div className={`toast toast-${toast.type}`}>
      <div className="toast-icon">
        <ion-icon name={getIcon()}></ion-icon>
      </div>
      <div className="toast-message">{toast.message}</div>
      <button className="toast-close" onClick={onClose}>
        <ion-icon name="close"></ion-icon>
      </button>
    </div>
  );
}
