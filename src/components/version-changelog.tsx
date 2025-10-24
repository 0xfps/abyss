import { ModalBg } from "./modal-bg";
import { ModalHeader } from "./modal-header";

export function VersionChangeLog() {
    return <ModalBg>
        <div>
            <ModalHeader title="Changelog" />

            
            <p className="mt-4 text-justify font-klartext-light">
                [24th October, 2025]<br /><br />

                [Read this.]<br /><br />
                1. By using this product (“Service”), you agree to these Terms.
                The Service is provided by [Your Company Name] for lawful, personal use only.
                All content and materials are owned by [Your Company Name] and protected by law.

                <br /><br />

                2. The Service is provided “as is,” without warranties of any kind.
                [Your Company Name] is not liable for any damages, including data loss or interruption,
                arising from use.

                <br /><br />

                3. Use of the Service also means you accept our Privacy Policy.
                We may update these Terms without notice, and continued use implies acceptance.
                These Terms are governed by the laws of [Your Country/State].
            </p>
        </div>
    </ModalBg>
}