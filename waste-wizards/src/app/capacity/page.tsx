"use client";
import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

// Use the environment variable
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function CapacityPage() {

    // Define types for your state
    interface BinData {
        name: string;
        capacity: number;
        fill: string;
    }

    interface LocationData {
        latitude: number;
        longitude: number;
        lastUpdated: string;
        address: string;
    }

    // Use the types in your state declarations
    const [binData, setBinData] = useState<BinData[]>([
        { name: 'Trash', capacity: 75, fill: '#6b7280' },
        { name: 'Recyclables', capacity: 45, fill: '#3b82f6' },
        { name: 'Compost', capacity: 30, fill: '#10b981' },
    ]);

    const [location, setLocation] = useState<LocationData>({
        latitude: 30.615011,
        longitude: -96.342476,
        lastUpdated: new Date().toLocaleString(),
        address: 'Loading address...'
    });

    const [mounted, setMounted] = useState(false);

    // Fetch address from coordinates
    const fetchAddress = async (lat: number, lng: number) => {
        try {
            const response = await fetch(`/api/reverse-geocode?lat=${lat}&lng=${lng}`);

            // Check if response is OK before parsing JSON
            if (!response.ok) {
                console.error(`API returned ${response.status}: ${response.statusText}`);
                return;
            }

            const data = await response.json();

            if (data.address) {
                setLocation(prev => ({
                    ...prev,
                    address: data.address,
                    lastUpdated: new Date().toLocaleString()
                }));
            }
        } catch (error) {
            console.error("Error fetching address:", error);
            // Set a fallback address instead of leaving it in a loading state
            setLocation(prev => ({
                ...prev,
                address: `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
                lastUpdated: new Date().toLocaleString()
            }));
        }
    };

    // Only render once on client-side
    useEffect(() => {
        setMounted(true);
    }, []);

    // Update address when coordinates change
    useEffect(() => {
        fetchAddress(location.latitude, location.longitude);
    }, [location.latitude, location.longitude]);

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar />
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-semibold text-blue-900 mb-8">Bin Capacity Monitoring</h1>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column - Bin Capacity Chart */}
                    <div className="bg-green-50 p-6 rounded-xl shadow-md">
                        <h2 className="text-2xl text-blue-900 mb-6">Current Fill Levels</h2>

                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={binData}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis label={{ value: 'Capacity %', angle: -90, position: 'insideLeft' }} domain={[0, 100]} />
                                    <Tooltip
                                        formatter={(value, name, props) => [`${value}%`, 'Fill Level']}
                                        labelFormatter={(label) => {
                                            const bin = binData.find(b => b.name === label);
                                            return `${label} (${bin?.type})`;
                                        }}
                                    />
                                    <Legend />
                                    <Bar
                                        dataKey="capacity"
                                        name="Fill Level"
                                        fill="#8884d8"  // Use a default color here
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-6 space-y-4">
                            {binData.map((bin) => (
                                <div key={bin.name} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: bin.fill }}></div>
                                        <span className="font-medium">{bin.name}:</span>
                                        <span className="ml-2 text-gray-600">{bin.type}</span>
                                    </div>
                                    <div className="w-64 bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="h-2.5 rounded-full"
                                            style={{
                                                width: `${bin.capacity}%`,
                                                backgroundColor: bin.fill,
                                            }}
                                        ></div>
                                    </div>
                                    <span className={`ml-2 ${bin.capacity > 80 ? 'text-red-600 font-semibold' : 'text-gray-700'}`}>
                                        {bin.capacity}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Map Location */}
                    <div className="bg-green-50 p-6 rounded-xl shadow-md">
                        <h2 className="text-2xl text-blue-900 mb-6">Device Location</h2>

                        {/* Google Maps Embed */}
                        <div className="h-80 rounded-lg overflow-hidden mb-4">
                            <iframe
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                                src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${location.latitude},${location.longitude}&zoom=15`}
                            ></iframe>
                        </div>

                        {/* Location Details */}
                        <div className="space-y-3 bg-white p-4 rounded-lg">
                            <div className="flex items-start">
                                <svg className="h-5 w-5 text-blue-800 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <div>
                                    <h3 className="font-medium text-gray-900">Address</h3>
                                    <p className="text-gray-700">{location.address}</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <svg className="h-5 w-5 text-blue-800 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                                <div>
                                    <h3 className="font-medium text-gray-900">Coordinates</h3>
                                    <p className="text-gray-700">{location.latitude}, {location.longitude}</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <svg className="h-5 w-5 text-blue-800 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <h3 className="font-medium text-gray-900">Last Updated</h3>
                                    {mounted ? (
                                        <p className="text-gray-700">{location.lastUpdated}</p>
                                    ) : (
                                        <p className="text-gray-700">Loading time...</p>
                                    )}                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}