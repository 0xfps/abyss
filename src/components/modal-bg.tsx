"use client"

import { ChildType } from "@/types/child-type";

export function ModalBg({ children }: ChildType) {
    return <div className="absolute top-0 p-0 m-0 left-0 right-0 bottom-0 w-[100%] h-[100%] backdrop-blur-[2px] flex justify-center items-center" data-aos="zoom-in">
        <div className="w-[98%] md:w-[70%] lg:w-[40%] xl:w-[25%] p-[4px] border-1 border-modal-border">
            <div className="p-2 bg-modal-bg">
                {children}
            </div>
        </div>
    </div>
}