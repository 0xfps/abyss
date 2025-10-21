"use client"

import { ActionsAndListener } from "@/components/actions-and-listener"
import { AnnouncementAndFetcher } from "@/components/announcement-and-fetcher"
import NavBar from "@/components/nav-bar"

export default function HomePage() {;
    
    return <>
        <NavBar />
        <AnnouncementAndFetcher />
        <ActionsAndListener/>
    </>
}