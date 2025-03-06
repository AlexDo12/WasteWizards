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
    capacity: number;
}

interface DbBinConfig {
    bin_number: number;
    waste_type: string;
    capacity: number;
}

const wasteTypes: WasteType[] = [
    { id: "trash", name: "Trash", color: "#342c3a", icon: "🗑️" },
    { id: "recyclables", name: "Recyclables", color: "#7385c8", icon: "♻️" },
    { id: "paper", name: "Paper", color: "#829fab", icon: "📄" },
    { id: "plastic", name: "Plastic", color: "#83a2c6", icon: "🛍️" },
    { id: "glass", name: "Glass", color: "#83c6ae", icon: "🍷" },
    { id: "metal", name: "Metal", color: "#83B8C6", icon: "🥫" },
    { id: "compost", name: "Compost", color: "#8cc683", icon: "🍃" },
    { id: "electronics", name: "E-Waste", color: "#8389c6", icon: "📱" },
];

export default function ConfigurePage() {
    // State for page load animation
    const [isLoaded, setIsLoaded] = useState(false);

    // Loading state
    const [isLoading, setIsLoading] = useState(true);

    // Default bin configuration (fallback if database fetch fails)
    const defaultBins: Bin[] = [
        { id: 1, type: "trash", name: "Trash", color: "#82ab9b", icon: "🗑️", capacity: 0 },
        { id: 2, type: "plastic", name: "Plastic", color: "#83a2c6", icon: "🧴", capacity: 0 },
        { id: 3, type: "compost", name: "Compost", color: "#8cc683", icon: "🍃", capacity: 0 },
    ];

    // State for the three bins
    const [bins, setBins] = useState<Bin[]>(defaultBins);

    // State to store the initial bins after fetching from database
    const [initialBins, setInitialBins] = useState<Bin[]>(defaultBins);

    // State to track if configuration has changed
    const [hasChanges, setHasChanges] = useState(false);

    // State for the currently selected bin (when configuring)
    const [selectedBin, setSelectedBin] = useState<number | null>(null);

    // State for tracking if the confirmation is successful
    const [confirmed, setConfirmed] = useState(false);

    // Function to find a waste type by ID
    const getWasteTypeById = (id: string): WasteType => {
        return wasteTypes.find(type => type.id === id) ||
            { id: "unknown", name: "Unknown", color: "#cccccc", icon: "❓" };
    };

    // Fetch bin configurations from the database on component mount
    useEffect(() => {
        const fetchBinConfigurations = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/bin-configurations');

                if (!response.ok) {
                    throw new Error('Failed to fetch bin configurations');
                }

                const data: DbBinConfig[] = await response.json();
                // If we have data, map it to our Bin format
                if (data && data.length > 0) {
                    const fetchedBins = data.map(item => {
                        const wasteType = getWasteTypeById(item.waste_type);
                        return {
                            id: item.bin_number,
                            type: item.waste_type,
                            name: wasteType.name,
                            color: wasteType.color,
                            icon: wasteType.icon,
                            capacity: item.capacity || 0
                        };
                    });

                    // Ensure we have all 3 bins
                    const completeBins = [...fetchedBins];

                    // Add any missing bins with default values
                    for (let i = 1; i <= 3; i++) {
                        if (!completeBins.find(bin => bin.id === i)) {
                            const defaultBin = defaultBins.find(bin => bin.id === i);
                            if (defaultBin) {
                                completeBins.push(defaultBin);
                            }
                        }
                    }

                    // Sort by bin number
                    completeBins.sort((a, b) => a.id - b.id);

                    // Update both bins and initialBins
                    setBins(completeBins);
                    setInitialBins(completeBins);
                }
            } catch (error) {
                console.error('Error fetching bin configurations:', error);
                // Use default values if fetch fails
                setBins(defaultBins);
                setInitialBins(defaultBins);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBinConfigurations();

        // Trigger page load animation after a slight delay
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    // Check if configuration has changed from initial state
    useEffect(() => {
        const configChanged = JSON.stringify(bins) !== JSON.stringify(initialBins);
        setHasChanges(configChanged);
    }, [bins, initialBins]);

    // Determine if a bin is configurable (first bin is not configurable, others only if capacity < 5.00)
    const isBinConfigurable = (bin: Bin) => {
        if (bin.id === 1) return false; // First bin is never configurable
        return bin.capacity < 5.00; // Other bins only if capacity is below 5.00
    };

    // Get message for bin status
    const getBinStatusMessage = (bin: Bin) => {
        if (bin.id === 1) return "Primary bin (not configurable)";
        if (bin.capacity >= 5.00) return "Please empty bin before reconfiguring";
        return "Click to configure";
    };

    // Select a bin to configure
    const handleBinSelect = (bin: Bin) => {
        if (!isBinConfigurable(bin)) return; // Don't allow selection if not configurable

        setSelectedBin(bin.id);
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

    // Confirm configuration and save to database
    const handleConfirm = async () => {
        try {
            // Create an array of configuration objects to send to the API
            const configsToSave = bins.map(bin => ({
                bin_number: bin.id,
                waste_type: bin.type,
                capacity: bin.capacity
            }));

            // Send the configurations to the API
            const response = await fetch('/api/bin-configurations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(configsToSave),
            });

            if (!response.ok) {
                throw new Error('Failed to update bin configurations');
            }

            // Update initialBins to match current bins
            setInitialBins([...bins]);

            // Show success message
            setConfirmed(true);

            // Hide success message after a delay
            setTimeout(() => {
                setConfirmed(false);
            }, 3000);
        } catch (error) {
            console.error('Error saving bin configurations:', error);
            alert('Failed to save configuration. Please try again.');
        }
    };

    return (
        <div className={`flex flex-col min-h-screen bg-white ${poppins.className}`}>
            <Navbar />
            <div className={`container mx-auto px-4 py-8 flex-1 transition-all duration-1000 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <h1 className="text-3xl font-semibold text-blue-900 mb-8 text-center">
                    Configure Your Waste Wizard Bins ⚙️
                </h1>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left: Bin Configuration Section */}
                    <div className="md:col-span-2 flex flex-col items-center justify-center">
                        <div className="bg-green-50 rounded-xl shadow-lg p-6 w-full transform transition-all duration-500 hover:shadow-xl">
                            <h2 className="text-2xl text-blue-900 mb-6 text-center">Current Configuration</h2>

                            {/* Loading state */}
                            {isLoading ? (
                                <div className="flex justify-center items-center py-16">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
                                </div>
                            ) : (
                                /* Three bins in a row */
                                <div className="flex flex-wrap justify-center gap-8 mb-4">
                                    {bins.map((bin, index) => {
                                        const configurable = isBinConfigurable(bin);
                                        const statusMessage = getBinStatusMessage(bin);

                                        return (
                                            <div key={bin.id} className="flex flex-col items-center">
                                                <div
                                                    onClick={() => configurable && handleBinSelect(bin)}
                                                    className={`
                                                      relative w-44 h-44 rounded-full flex flex-col items-center justify-center
                                                      transition-all duration-300 shadow-md border-2 border-white
                                                      ${selectedBin === bin.id ? 'ring-4 ring-blue-500 ring-opacity-70 scale-105' : ''}
                                                      ${configurable ? 'cursor-pointer hover:shadow-lg hover:scale-105' : 'cursor-default opacity-90'}
                                                    `}
                                                    style={{
                                                        backgroundColor: bin.color,
                                                        animationDelay: `${index * 200 + 300}ms`,
                                                        animation: isLoaded ? 'fadeInUp 0.6s ease-out forwards' : 'none'
                                                    }}
                                                >
                                                    <span className="text-5xl mb-2">{bin.icon}</span>
                                                    <span className="text-white text-lg font-medium text-center px-2 mb-1">
                                                        Bin {bin.id}: {bin.name}
                                                    </span>
                                                    <div className="absolute top-3 right-3 bg-green-100 text-blue-900 text-xs py-1 px-2 rounded-full font-medium border border-green-200">
                                                        {bin.capacity.toFixed(2)}
                                                    </div>
                                                </div>
                                                {/* Status message below the bin instead of overlapping */}
                                                <div className="mt-2 text-center">
                                                    <span className={`inline-block text-xs py-1 px-3 rounded-full font-medium ${bin.id === 1
                                                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                                        : bin.capacity >= 5.00
                                                            ? 'bg-red-100 text-red-700 border border-red-200'
                                                            : 'bg-green-100 text-green-700 border border-green-200'
                                                        }`}>
                                                        {statusMessage}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Status Message */}
                            <div className="text-center mb-6 min-h-[2rem] transition-all duration-300">
                                {isLoading ? (
                                    <p className="text-lg text-blue-800">
                                        Loading bin configurations...
                                    </p>
                                ) : selectedBin !== null ? (
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
                                        Bin 1 is not configurable. Other bins can be configured if their capacity is below 5.00.
                                    </p>
                                )}
                            </div>

                            {/* Confirm Button */}
                            <div className="flex justify-center">
                                <button
                                    onClick={handleConfirm}
                                    disabled={!hasChanges || isLoading}
                                    className={`px-6 py-3 rounded-lg text-white font-medium transition-all duration-300
                                      transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
                                      ${!hasChanges || isLoading
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

                        <div>
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