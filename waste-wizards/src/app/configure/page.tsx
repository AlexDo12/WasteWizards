"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Poppins } from 'next/font/google';

// Initialize the Poppins font
const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '500', '600'],
    display: 'swap',
});

// TypeScript interfaces
interface WasteType {
    id: string;
    name: string;
    color: string;
    icon: string;
}

interface Bin {
    id: number;
    type: string;
    name: string;
    color: string;
    icon: string;
}

const wasteTypes: WasteType[] = [
    { id: "trash", name: "Trash", color: "#82ab9b", icon: "🗑️" },
    { id: "paper", name: "Paper", color: "#829fab", icon: "📄" },
    { id: "plastic", name: "Plastic", color: "#83a2c6", icon: "🧴" },
    { id: "glass", name: "Glass", color: "#83c6ae", icon: "🍶" },
    { id: "metal", name: "Metal", color: "#83B8C6", icon: "🥫" },
    { id: "compost", name: "Compost", color: "#8cc683", icon: "🍃" },
    { id: "electronics", name: "E-Waste", color: "#8389c6", icon: "📱" },
];

export default function ConfigurePage() {
    // State for page load animation
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial bin configuration
    const initialBins: Bin[] = [
        { id: 1, type: "trash", name: "Trash", color: "#82ab9b", icon: "🗑️" },
        { id: 2, type: "plastic", name: "Plastic", color: "#83a2c6", icon: "🧴" },
        { id: 3, type: "compost", name: "Compost", color: "#8cc683", icon: "🍃" },
    ];

    // State for the three bins
    const [bins, setBins] = useState<Bin[]>(initialBins);

    // State to track if configuration has changed
    const [hasChanges, setHasChanges] = useState(false);

    // State for the currently selected bin (when configuring)
    const [selectedBin, setSelectedBin] = useState<number | null>(null);

    // State for tracking if the confirmation is successful
    const [confirmed, setConfirmed] = useState(false);

    // Trigger page load animation after component mounts
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    // Check if configuration has changed from initial state
    useEffect(() => {
        const configChanged = JSON.stringify(bins) !== JSON.stringify(initialBins);
        setHasChanges(configChanged);
    }, [bins]);

    // Select a bin to configure
    const handleBinSelect = (binId: number) => {
        setSelectedBin(binId);
        setConfirmed(false);
    };

    // Change the waste type of the selected bin
    const handleWasteTypeSelect = (wasteType: WasteType) => {
        if (selectedBin !== null) {
            setBins(
                bins.map((bin) =>
                    bin.id === selectedBin
                        ? {
                            ...bin,
                            type: wasteType.id,
                            name: wasteType.name,
                            color: wasteType.color,
                            icon: wasteType.icon
                        }
                        : bin
                )
            );
            // Automatically deselect the bin after selecting a type
            setSelectedBin(null);
        }
    };

    // Confirm configuration
    const handleConfirm = () => {
        // In a real app, you would send this configuration to your backend
        console.log("Configuration confirmed:", bins);
        setConfirmed(true);

        // Show confirmation message briefly
        setTimeout(() => {
            setConfirmed(false);
        }, 3000);
    };


    return (
        <div className={`flex flex-col min-h-screen bg-white ${poppins.className}`}>
            <Navbar />
            <div className={`container mx-auto px-4 py-8 flex-1 transition-all duration-1000 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <h1 className="text-3xl font-semibold text-blue-900 mb-8 text-center">
                    Configure Your Waste Wizard Bins
                </h1>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left: Bin Configuration Section */}
                    <div className="md:col-span-2 flex flex-col items-center justify-center">
                        <div className="bg-green-50 rounded-xl shadow-lg p-6 w-full transform transition-all duration-500 hover:shadow-xl">
                            <h2 className="text-2xl text-blue-900 mb-6 text-center">Current Configuration</h2>

                            {/* Three bins in a row */}
                            <div className="flex flex-wrap justify-center gap-8 mb-8">
                                {bins.map((bin, index) => (
                                    <div
                                        key={bin.id}
                                        onClick={() => handleBinSelect(bin.id)}
                                        className={`
                                          w-44 h-44 rounded-full flex flex-col items-center justify-center cursor-pointer
                                          transition-all duration-300 shadow-md border-2 border-white
                                          ${selectedBin === bin.id ? 'ring-4 ring-blue-500 ring-opacity-70 scale-105' : 'hover:shadow-lg hover:scale-105'}
                                        `}
                                        style={{
                                            backgroundColor: bin.color,
                                            animationDelay: `${index * 200 + 300}ms`,
                                            animation: isLoaded ? 'fadeInUp 0.6s ease-out forwards' : 'none'
                                        }}
                                    >
                                        <span className="text-5xl mb-3 transition-transform duration-300 group-hover:scale-110">{bin.icon}</span>
                                        <span className="text-white text-lg font-medium text-center px-2">
                                            Bin {bin.id}: {bin.name}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Status Message */}
                            <div className="text-center mb-6 min-h-[2rem] transition-all duration-300">
                                {selectedBin !== null ? (
                                    <p className="text-lg text-blue-800 animate-fadeIn">
                                        Select a waste type for Bin {selectedBin} from the sidebar
                                    </p>
                                ) : confirmed ? (
                                    <p className="text-lg text-green-600 font-medium animate-pulse">
                                        Configuration saved successfully!
                                    </p>
                                ) : hasChanges ? (
                                    <p className="text-lg text-blue-800 animate-fadeIn">
                                        Configuration has changed. Click confirm to save changes.
                                    </p>
                                ) : (
                                    <p className="text-lg font-light text-blue-800">
                                        Click on a bin to configure its waste type
                                    </p>
                                )}
                            </div>

                            {/* Confirm Button */}
                            <div className="flex justify-center">
                                <button
                                    onClick={handleConfirm}
                                    disabled={!hasChanges}
                                    className={`px-6 py-3 rounded-lg text-white font-medium transition-all duration-300
                                      transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
                                      ${!hasChanges
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-green-500 hover:bg-green-600 hover:shadow-md'}`}
                                >
                                    Confirm Configuration
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Waste Type Selector */}
                    <div className="bg-green-50 rounded-xl shadow-lg p-6 transform transition-all duration-500 hover:shadow-xl">
                        <h2 className="text-2xl text-blue-900 mb-6 text-center">
                            Available Waste Types
                        </h2>

                        <div className="space-y-4">
                            {wasteTypes.map((wasteType, index) => (
                                <div
                                    key={wasteType.id}
                                    onClick={() => selectedBin !== null && handleWasteTypeSelect(wasteType)}
                                    className={`flex items-center p-4 rounded-lg transition-all duration-300 
                                      ${selectedBin !== null
                                            ? 'cursor-pointer hover:bg-white hover:shadow-md transform hover:-translate-y-1'
                                            : 'opacity-70'
                                        }`}
                                    style={{
                                        animationDelay: `${index * 100 + 500}ms`,
                                        animation: isLoaded ? 'fadeInRight 0.5s ease-out forwards' : 'none'
                                    }}
                                >
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center mr-4 transition-transform duration-300 hover:scale-110"
                                        style={{ backgroundColor: wasteType.color }}
                                    >
                                        <span className="text-2xl">{wasteType.icon}</span>
                                    </div>
                                    <span className="text-lg text-blue-900">{wasteType.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add CSS animations */}
            <style jsx global>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes fadeInRight {
                    from {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-in-out;
                }
                
                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
            `}</style>
        </div>
    );
}