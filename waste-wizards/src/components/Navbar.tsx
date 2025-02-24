// src/components/Navbar.jsx
import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="w-full bg-red-700 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">Waste Wizard</Link>
                <div className="flex gap-6">
                    <Link href="/" className="hover:underline">Home</Link>
                    <Link href="/capacity" className="hover:underline">Capacity</Link>
                    <Link href="/statistics" className="hover:underline">Statistics</Link>
                    <Link href="/configure" className="hover:underline">Configure</Link>
                </div>
            </div>
        </nav>
    );
}