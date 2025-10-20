import { useEffect, useState } from "react"
import { TbFidgetSpinner } from "react-icons/tb";
import { PiCloudCheckFill } from "react-icons/pi";
import { useFetchLeafCount } from "@/hooks/use-fetch-leaf-count";

export function Fetcher() {
    const leafCount = useFetchLeafCount()
    const [width, setWidth] = useState<number>(100)

    return <div className="py-2 md:p-2 col-span-4 md:col-span-1">
        <div className="flex justify-start items-center">
            <span className="text-xl text-btn-success">
                {width < 100 ? <TbFidgetSpinner className="spinner" /> : <PiCloudCheckFill />}
            </span>
            <span className="ml-2 text-sm md:text-base">
                {width < 100 && "Fetching leaves... (2,300/45,878)"}
                {width >= 100 && "Fetched leaves. (45,878/45,878)"}
                ({width}%)
            </span>
        </div>
        <div className="border-1 border-btn-success p-1 mt-1">
            <div className="bg-btn-success p-2" style={{ width: `${width}%` }}></div>
        </div>
    </div>
}