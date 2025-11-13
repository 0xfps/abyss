import { Actions } from "./actions";
import { Listener } from "./listener";

export function ActionsAndListener() {
    return <div className="grid grid-cols-6 p-2 gap-2 mt-2">
        <Actions />
        <Listener/>
    </div>
}