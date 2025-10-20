import { IoClose } from "react-icons/io5";

export function Announcement() {
    return <div className="text-sm bg-red-200 h-full col-span-4 md:col-span-3 flex justify-between items-center">
        <span>
            <span>💡</span>
            <span className="ml-3">This is an announcement.</span>
        </span>

        <IoClose className="text-xl cursor-pointer hover:opacity-80"/>
    </div>
}