export type ToastProps = {
    id: string | number;
    title: string;
    description: string;
    icon:  React.ReactNode,
    action?: () => void;
    button?: {
        label?: string;
        onClick: () => void;
    };
}