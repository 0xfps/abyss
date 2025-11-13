import { LATEST_ANNOUNCEMENT } from "@/utils/constants";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

export function Announcement() {
    const [hasSeenLatestAnnouncement, setHasSeenLatestAnnouncemet] = useState<boolean>(false)

    useEffect(function () {
        const hasSeen = localStorage.getItem(LATEST_ANNOUNCEMENT)
        setHasSeenLatestAnnouncemet(hasSeen === "true")
    }, [])

    function see() {
        localStorage.setItem(LATEST_ANNOUNCEMENT, "true")
        setHasSeenLatestAnnouncemet(true)
    }

    return <div className="text-sm h-[60px] lg:h-full col-span-6 lg:col-span-4">
        {
            !hasSeenLatestAnnouncement ?
                <div className="bg-modal-bg h-full flex justify-between items-center px-1 md:px-3">
                    <span>
                        <span>💡</span>
                        <span className="ml-3">This is an announcement.</span>
                    </span>

                    <IoClose className="text-xl cursor-pointer hover:opacity-80" onClick={see} />
                </div>
                : <div className="bg-modal-bg h-full flex justify-between items-center px-1 md:px-3">
                    <span>
                        <span>💡</span>
                        <span className="ml-3">No new announcements.</span>
                    </span>
                </div>
        }
    </div>
}