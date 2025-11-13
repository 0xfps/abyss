"use client"

import { ChildType } from "@/types/child-type"
import Aos from "aos"
import { createContext, useEffect } from "react"
import "aos/dist/aos.css"

export const AOSContext = createContext<"">("")

export function AOSProvider({ children }: ChildType) {
    useEffect(function () {
        Aos.init({
            duration: 100,
            once: false
        })
    }, [])

    return <AOSContext.Provider value="">
        {children}
    </AOSContext.Provider>
}