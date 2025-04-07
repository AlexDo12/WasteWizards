"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Poppins } from 'next/font/google';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

// Initialize the Poppins font
const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '500', '600'],
    display: 'swap',
});

// TypeScript interfaces
interface WasteItem {
    id: number;
    waste_type: string;
    bin_number: number;
    time: string; // Changed from timestamp to time
    username: string;
    trashcan: number;
}

interface WasteTypeTotal {
    name: string;
    value: number;
    color: string;
}

interface DailyCount {
    date: string;
    count: number;
}

interface DailyTypeCounts {
    date: string;
    [key: string]: string | number;
}

// Colors for different waste types
const wasteTypeColors: Record<string, string> = {
    'trash': '#82ab9b',
    'plastic': '#83a2c6',
    'compost': '#8cc683',
    'paper': '#829fab',
    'glass': '#83c6ae',
    'metal': '#83B8C6',
    'recyclables': '#829fab',
    'cardboard': '#8389c6'
};

// Format names for display
const formatWasteType = (type: string): string => {
    return type.charAt(0).toUpperCase() + type.slice(1);
};

export default function StatisticsPage() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [wasteItems, setWasteItems] = useState<WasteItem[]>([]);
    const [timeRange, setTimeRange] = useState('week'); // 'week', 'month', 'all'

    // Derived state for charts
    const [wasteTypeTotals, setWasteTypeTotals] = useState<WasteTypeTotal[]>([]);
    const [dailyCounts, setDailyCounts] = useState<DailyCount[]>([]);
    const [dailyTypeCounts, setDailyTypeCounts] = useState<DailyTypeCounts[]>([]);
    const [binDistribution, setBinDistribution] = useState<WasteTypeTotal[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [mostCommonType, setMostCommonType] = useState('');

    // Fetch waste items data
    useEffect(() => {
        const fetchWasteItems = async () => {
            setIsLoading(true);
            try {
                // Hardcode trashcan=1 in the API call
                const response = await fetch(`/api/waste-statistics?timeRange=${timeRange}&trashcan=1`);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('API Error:', errorText);
                    throw new Error('Failed to fetch waste statistics');
                }

                const data: WasteItem[] = await response.json();
                setWasteItems(data);

                // Process data for various charts and metrics
                processData(data);
            } catch (error) {
                console.error('Error fetching waste statistics:', error);
                // Initialize with empty data
                setWasteItems([]);
                processData([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWasteItems();

        // Trigger page load animation
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 100);

        return () => clearTimeout(timer);
    }, [timeRange]);

    // Process the waste items into various chart formats
    const processData = (items: WasteItem[]) => {
        // Calculate total items
        setTotalItems(items.length);

        // Calculate totals by waste type for pie chart
        const wasteTypeCounts: Record<string, number> = {};
        items.forEach(item => {
            wasteTypeCounts[item.waste_type] = (wasteTypeCounts[item.waste_type] || 0) + 1;
        });

        const typeData = Object.entries(wasteTypeCounts).map(([type, count]) => ({
            name: formatWasteType(type),
            value: count,
            color: wasteTypeColors[type] || '#cccccc'
        }));

        setWasteTypeTotals(typeData);

        // Find most common waste type
        if (typeData.length > 0) {
            const mostCommon = typeData.reduce((prev, current) =>
                prev.value > current.value ? prev : current
            );
            setMostCommonType(mostCommon.name);
        } else {
            setMostCommonType('None');
        }

        // Calculate totals by bin number
        const binCounts: Record<string, number> = {};
        items.forEach(item => {
            const binKey = `Bin ${item.bin_number}`;
            binCounts[binKey] = (binCounts[binKey] || 0) + 1;
        });

        const binData = Object.entries(binCounts).map(([bin, count], index) => ({
            name: bin,
            value: count,
            color: Object.values(wasteTypeColors)[index % Object.values(wasteTypeColors).length]
        }));

        setBinDistribution(binData);

        // Daily counts for line chart
        const dailyData: Record<string, number> = {};
        const dailyTypeData: Record<string, Record<string, number>> = {};

        items.forEach(item => {
            // Format date as YYYY-MM-DD
            const date = new Date(item.time).toISOString().split('T')[0]; // Changed from timestamp to time

            // Count total items per day
            dailyData[date] = (dailyData[date] || 0) + 1;

            // Count items by type per day
            if (!dailyTypeData[date]) {
                dailyTypeData[date] = {};
            }

            dailyTypeData[date][item.waste_type] =
                (dailyTypeData[date][item.waste_type] || 0) + 1;
        });

        // Convert to array format for charts
        const dailyCountsData = Object.keys(dailyData)
            .sort()
            .map(date => ({
                date: date,
                count: dailyData[date]
            }));

        setDailyCounts(dailyCountsData);

        // Create data for stacked bar chart
        const typesByDay = Object.keys(dailyTypeData)
            .sort()
            .map(date => {
                const entry: DailyTypeCounts = { date };
                Object.keys(dailyTypeData[date]).forEach(type => {
                    entry[type] = dailyTypeData[date][type];
                });
                return entry;
            });

        setDailyTypeCounts(typesByDay);
    };

    const handleTimeRangeChange = (range: string) => {
        setTimeRange(range);
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className={`flex flex-col min-h-screen bg-white ${poppins.className}`}>
            <Navbar />
            <div className={`container mx-auto px-4 py-8 flex-1 transition-all duration-1000 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <h1 className="text-3xl font-semibold text-blue-900 mb-8 text-center">
                    Waste Wizard Statistics 📊
                </h1>

                {/* Time Range Selector */}
                <div className="mb-8 flex justify-center">
                    <div className="inline-flex rounded-md shadow-sm" role="group">
                        <button
                            type="button"
                            onClick={() => handleTimeRangeChange('week')}
                            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${timeRange === 'week'
                                ? 'bg-blue-800 text-white'
                                : 'bg-green-50 text-blue-800 hover:bg-green-100'
                                }`}
                        >
                            Last Week
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTimeRangeChange('month')}
                            className={`px-4 py-2 text-sm font-medium ${timeRange === 'month'
                                ? 'bg-blue-800 text-white'
                                : 'bg-green-50 text-blue-800 hover:bg-green-100'
                                }`}
                        >
                            Last Month
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTimeRangeChange('all')}
                            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${timeRange === 'all'
                                ? 'bg-blue-800 text-white'
                                : 'bg-green-50 text-blue-800 hover:bg-green-100'
                                }`}
                        >
                            All Time
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
                    </div>
                ) : (
                    <>
                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div
                                className="bg-green-50 rounded-xl shadow-lg p-6 transform transition-all duration-500 hover:shadow-xl"
                                style={{ animation: isLoaded ? 'fadeInUp 0.6s ease-out forwards' : 'none' }}
                            >
                                <h2 className="text-xl text-blue-900 mb-4 text-center">Total Items</h2>
                                <p className="text-4xl font-bold text-center text-blue-800">{totalItems}</p>
                            </div>

                            <div
                                className="bg-green-50 rounded-xl shadow-lg p-6 transform transition-all duration-500 hover:shadow-xl"
                                style={{ animation: isLoaded ? 'fadeInUp 0.6s ease-out forwards' : 'none', animationDelay: '200ms' }}
                            >
                                <h2 className="text-xl text-blue-900 mb-4 text-center">Most Common Type</h2>
                                <p className="text-4xl font-bold text-center text-blue-800">
                                    {mostCommonType}
                                </p>
                            </div>

                            <div
                                className="bg-green-50 rounded-xl shadow-lg p-6 transform transition-all duration-500 hover:shadow-xl"
                                style={{ animation: isLoaded ? 'fadeInUp 0.6s ease-out forwards' : 'none', animationDelay: '400ms' }}
                            >
                                <h2 className="text-xl text-blue-900 mb-4 text-center">Daily Average</h2>
                                <p className="text-4xl font-bold text-center text-blue-800">
                                    {dailyCounts.length > 0
                                        ? Math.round(totalItems / dailyCounts.length * 10) / 10
                                        : 0}
                                </p>
                            </div>
                        </div>

                        {/* Charts Row 1 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            {/* Pie Chart - Waste Type Distribution */}
                            <div
                                className="bg-green-50 rounded-xl shadow-lg p-6 transform transition-all duration-500 hover:shadow-xl"
                                style={{ animation: isLoaded ? 'fadeInUp 0.6s ease-out forwards' : 'none', animationDelay: '200ms' }}
                            >
                                <h2 className="text-xl text-blue-900 mb-4 text-center">Waste Type Distribution</h2>
                                <div className="h-80">
                                    {wasteTypeTotals.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={wasteTypeTotals}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {wasteTypeTotals.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    formatter={(value) => [`${value} items`, 'Count']}
                                                    contentStyle={{ background: 'rgba(255, 255, 255, 0.9)', borderRadius: '0.5rem' }}
                                                />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <p className="text-gray-500 text-center">No data available for the selected time period</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Pie Chart - Bin Distribution */}
                            <div
                                className="bg-green-50 rounded-xl shadow-lg p-6 transform transition-all duration-500 hover:shadow-xl"
                                style={{ animation: isLoaded ? 'fadeInUp 0.6s ease-out forwards' : 'none', animationDelay: '400ms' }}
                            >
                                <h2 className="text-xl text-blue-900 mb-4 text-center">Bin Usage Distribution</h2>
                                <div className="h-80">
                                    {binDistribution.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={binDistribution}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {binDistribution.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    formatter={(value) => [`${value} items`, 'Count']}
                                                    contentStyle={{ background: 'rgba(255, 255, 255, 0.9)', borderRadius: '0.5rem' }}
                                                />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <p className="text-gray-500 text-center">No data available for the selected time period</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Charts Row 2 */}
                        <div className="grid grid-cols-1 gap-8 mb-8">
                            {/* Line Chart - Daily Items */}
                            <div
                                className="bg-green-50 rounded-xl shadow-lg p-6 transform transition-all duration-500 hover:shadow-xl"
                                style={{ animation: isLoaded ? 'fadeInUp 0.6s ease-out forwards' : 'none', animationDelay: '600ms' }}
                            >
                                <h2 className="text-xl text-blue-900 mb-4 text-center">Daily Item Count</h2>
                                <div className="h-80">
                                    {dailyCounts.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart
                                                data={dailyCounts}
                                                margin={{
                                                    top: 5,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis
                                                    dataKey="date"
                                                    tickFormatter={formatDate}
                                                />
                                                <YAxis />
                                                <Tooltip
                                                    labelFormatter={formatDate}
                                                    formatter={(value) => [`${value} items`, 'Count']}
                                                    contentStyle={{ background: 'rgba(255, 255, 255, 0.9)', borderRadius: '0.5rem' }}
                                                />
                                                <Legend />
                                                <Line
                                                    type="monotone"
                                                    dataKey="count"
                                                    name="Items"
                                                    stroke="#82ca9d"
                                                    activeDot={{ r: 8 }}
                                                    strokeWidth={2}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <p className="text-gray-500 text-center">No data available for the selected time period</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Stacked Bar - Waste Type by Day */}
                            <div
                                className="bg-green-50 rounded-xl shadow-lg p-6 transform transition-all duration-500 hover:shadow-xl"
                                style={{ animation: isLoaded ? 'fadeInUp 0.6s ease-out forwards' : 'none', animationDelay: '800ms' }}
                            >
                                <h2 className="text-xl text-blue-900 mb-4 text-center">Waste Type by Day</h2>
                                <div className="h-96">
                                    {dailyTypeCounts.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={dailyTypeCounts}
                                                margin={{
                                                    top: 20,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis
                                                    dataKey="date"
                                                    tickFormatter={formatDate}
                                                />
                                                <YAxis />
                                                <Tooltip
                                                    labelFormatter={formatDate}
                                                    formatter={(value, name) => [`${value} items`, formatWasteType(name.toString())]}
                                                    contentStyle={{ background: 'rgba(255, 255, 255, 0.9)', borderRadius: '0.5rem' }}
                                                />
                                                <Legend formatter={(value) => formatWasteType(value)} />
                                                {Object.keys(wasteTypeColors).map((type) => (
                                                    dailyTypeCounts.some(entry => entry[type] !== undefined) && (
                                                        <Bar
                                                            key={type}
                                                            dataKey={type}
                                                            stackId="a"
                                                            name={type}
                                                            fill={wasteTypeColors[type] || '#cccccc'}
                                                        />
                                                    )
                                                ))}
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <p className="text-gray-500 text-center">No data available for the selected time period</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Recent Items Table */}
                        <div
                            className="bg-green-50 rounded-xl shadow-lg p-6 transform transition-all duration-500 hover:shadow-xl"
                            style={{ animation: isLoaded ? 'fadeInUp 0.6s ease-out forwards' : 'none', animationDelay: '1000ms' }}
                        >
                            <h2 className="text-xl text-blue-900 mb-4 text-center">Recent Items</h2>

                            {wasteItems.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bin</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {wasteItems.slice(0, 10).map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div
                                                                className="w-4 h-4 rounded-full mr-2"
                                                                style={{ backgroundColor: wasteTypeColors[item.waste_type] || '#cccccc' }}
                                                            ></div>
                                                            {formatWasteType(item.waste_type)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        Bin {item.bin_number}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {item.username}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(item.time).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="py-8 text-center">
                                    <p className="text-gray-500">No items found for the selected time period</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
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
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
        </div>
    );
}