import { Version } from "./version";

export function Footer() {
    return <div className="p-2 flex justify-end items-center mt-2 md:mt-8 z-2">
        <Version/>
    </div>
}