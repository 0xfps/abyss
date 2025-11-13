import { ModalBg } from "./modal-bg";
import { ModalHeader } from "./modal-header";

export function VersionChangeLog() {
    return <ModalBg>
        <div>
            <ModalHeader title="Changelog" />


            <p className="mt-4 text-justify font-klartext-light">
                [12th November, 2025]<br /><br />

                1. First Release.
            </p>
        </div>
    </ModalBg>
}