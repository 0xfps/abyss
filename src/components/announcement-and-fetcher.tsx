import { Announcement } from "./announcement";
import { Fetcher } from "./fetcher";

export function AnnouncementAndFetcher() {
    return <div className="p-2 mt-2 h-fit bg-amber-500 grid grid-cols-4 gap-2">
        <Announcement />
        <Fetcher/>
    </div>
}