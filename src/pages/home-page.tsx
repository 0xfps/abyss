"use client"

import { LegalTOSModal } from "@/components/legal-tos-modal"
import NavBar from "@/components/nav-bar"

export default function HomePage() {
    return <>
        <NavBar />
        <LegalTOSModal/>
    </>
}