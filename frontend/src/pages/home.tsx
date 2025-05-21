import LandingInfo from "@/components/home/landing-info.tsx";
import CreatePlanit from "@/components/home/create-planit.tsx";

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
            {/* Header */}
            <header className="text-center py-10 px-4">
                <h1 className="text-4xl font-bold mb-2 tracking-tight text-gray-900">Planit Hayrat</h1>
                <p className="text-md text-gray-600">Estimate smarter, together.</p>
            </header>

            {/* Main Content */}
            <main className="flex flex-col lg:flex-row justify-center gap-10 px-6 py-8 w-full max-w-7xl mx-auto flex-grow">
                {/* Left - Landing Info */}
                <div className="w-full lg:w-7/12 self-start">
                    <LandingInfo />
                </div>

                {/* Right - Create Room */}
                <div className="w-full lg:w-5/12 flex items-center justify-center">
                    <div className="w-full">
                        <CreatePlanit />
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-auto text-center text-xs text-gray-400 py-6">
                © 2025 Hayrat Planit – Open Source & Free Forever
            </footer>
        </div>
    );
}
