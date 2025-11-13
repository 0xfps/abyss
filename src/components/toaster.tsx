import { ToastProps } from '@/types/toast-props';
import { toast as sonnerToast } from 'sonner';
import { Toast } from './toast';

export function toaster(toast: Omit<ToastProps, 'id'>) {
    return sonnerToast.custom((id) => (
        <Toast
            id={id}
            title={toast.title}
            description={toast.description}
            icon={toast.icon}
            action={toast.action}
            button={{
                label: toast.button?.label,
                onClick: () => toast.button?.onClick,
            }}
        />
    ));
}