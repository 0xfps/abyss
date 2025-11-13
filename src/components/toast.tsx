import { ToastProps } from "@/types/toast-props";
import { toast as sonnerToast } from 'sonner';

export function Toast(props: ToastProps) {
    const { title, description, button, action, icon } = props;

    return <div className="p-3 font-klartext w-[500px]">
        <div className="flex justify-start items-center text-xl">
            <span className="">{icon}</span>
            <p className="ml-2 font-klartext-bold">{title} </p>
        </div>
        <div className="mt-3 font-klartext text-sm">
            {description}
        </div>
        <div className="mt-3">
            {
                action &&
                <button
                    className="w-full bg-btn-success py-3 cursor-pointer hover:opacity-80"
                    onClick={() => {
                        action()
                        sonnerToast.dismiss()
                    }}
                >
                    {button?.label}
                </button>
            }
        </div>
    </div>
}