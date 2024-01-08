"use client";

import dynamic from "next/dynamic";

const DynamicScene = dynamic(() => import("./components/Scene"), {
    ssr: false,
    loading: () => <p>Loading...</p>,
});

export default function App() {
    return (
        <div className="flex h-screen w-screen text-xs text-neutral-900">
            <div className="w-1/2 h-full flex flex-col p-4">
                <div className="flex flex-col items-center gap-4">
                    <DynamicScene />
                </div>
            </div>
            <div className="w-px bg-black h-full" />
            <div className="w-1/2 h-full overflow-y-auto">
                <div className="text-medium">
                    <div className="flex flex-row gap-4"></div>
                </div>
            </div>
        </div>
    );
}
