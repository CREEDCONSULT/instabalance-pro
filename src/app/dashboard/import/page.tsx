import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import FileUpload from "@/components/FileUpload";

export default function ImportPage() {
    return (
        <div className="min-h-screen bg-black text-white p-4">
            <div className="max-w-screen-sm mx-auto">
                <header className="flex items-center gap-4 mb-8 pt-4">
                    <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-zinc-900">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-2xl font-bold">Import Data</h1>
                </header>

                <section className="mb-8 p-6 bg-zinc-900 rounded-2xl border border-zinc-800">
                    <h2 className="text-lg font-bold mb-4">How to get your data</h2>
                    <ol className="space-y-4 text-sm text-zinc-400 list-decimal pl-4">
                        <li>Open Instagram and go to <span className="text-white font-medium">Settings & Privacy</span>.</li>
                        <li>Select <span className="text-white font-medium">Account Center</span> → <span className="text-white font-medium">Your information and permissions</span>.</li>
                        <li>Choose <span className="text-white font-medium">Download your information</span> and request a <span className="text-white font-medium">Partial Download</span>.</li>
                        <li>Select <span className="text-white font-medium">Following and followers</span> and choose Format: <span className="text-white font-medium">JSON</span>.</li>
                        <li>Once the file arrives, upload the followers and following JSON files below.</li>
                    </ol>
                </section>

                <FileUpload />

                <p className="mt-8 text-xs text-zinc-500 text-center leading-relaxed">
                    InstaBalance Pro processes your files locally on the server to compute your ratio.
                    We never store your Instagram credentials or interact with the app on your behalf.
                </p>
            </div>
        </div>
    );
}
