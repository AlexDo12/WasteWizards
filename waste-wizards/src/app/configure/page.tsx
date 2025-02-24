import Navbar from "@/components/Navbar";

export default function ConfigurePage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="container mx-auto p-8 flex items-center justify-center flex-1">
                <h1 className="text-2xl font-bold">Configure Page</h1>
            </div>
        </div>
    );
}