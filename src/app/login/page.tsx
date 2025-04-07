"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Poppins } from 'next/font/google';

// Initialize the Poppins font
const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '500', '600'],
    display: 'swap',
});

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Set a small delay to ensure animation plays smoothly
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    // Check if user is already logged in and redirect if needed
    useEffect(() => {
        // Check if we have a session cookie
        const hasCookie = document.cookie.split(';').some(item => item.trim().startsWith('session='));
        if (hasCookie) {
            console.log('Session cookie found, redirecting to dashboard');
            router.push('/');
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            console.log('Submitting login form...');
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            console.log('Login response:', data);

            if (response.ok) {
                // Successful login
                console.log('Login successful, redirecting...');
                // Force a hard navigation to refresh the page and apply the new cookie
                window.location.href = '/';
            } else {
                // Failed login
                console.log('Login failed:', data.error);
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred during login. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center bg-white transition-opacity duration-1000 relative overflow-hidden ${isLoaded ? 'opacity-100' : 'opacity-0'} ${poppins.className}`}>
            {/* Background Sparkles */}
            <div className="absolute top-20 left-10 w-9 h-9 text-green-400 opacity-60" style={{ animation: 'twinkle 4s infinite ease-in-out' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9.5 8.5l1.5 1.5-1.5 1.5L8 10l1.5-1.5zM12 1l2.5 5.5L20 9l-5.5 2.5L12 17l-2.5-5.5L4 9l5.5-2.5L12 1z" />
                </svg>
            </div>
            <div className="absolute top-40 left-6 w-6 h-6 text-blue-400 opacity-50" style={{ animation: 'twinkle 3s infinite ease-in-out 1s' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1l2.5 5.5L20 9l-5.5 2.5L12 17l-2.5-5.5L4 9l5.5-2.5L12 1z" />
                </svg>
            </div>
            <div className="absolute top-60 left-16 w-5 h-5 text-green-500 opacity-40" style={{ animation: 'twinkle 5s infinite ease-in-out 0.5s' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1l2.5 5.5L20 9l-5.5 2.5L12 17l-2.5-5.5L4 9l5.5-2.5L12 1z" />
                </svg>
            </div>
            <div className="absolute top-20 right-10 w-7 h-7 text-blue-400 opacity-50" style={{ animation: 'twinkle 4s infinite ease-in-out 1.5s' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1l2.5 5.5L20 9l-5.5 2.5L12 17l-2.5-5.5L4 9l5.5-2.5L12 1z" />
                </svg>
            </div>
            <div className="absolute top-48 right-16 w-8 h-8 text-green-400 opacity-45" style={{ animation: 'twinkle 6s infinite ease-in-out 0.7s' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1l2.5 5.5L20 9l-5.5 2.5L12 17l-2.5-5.5L4 9l5.5-2.5L12 1z" />
                </svg>
            </div>
            <div className="absolute top-72 right-8 w-5 h-5 text-blue-500 opacity-40" style={{ animation: 'twinkle 3.5s infinite ease-in-out 2s' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1l2.5 5.5L20 9l-5.5 2.5L12 17l-2.5-5.5L4 9l5.5-2.5L12 1z" />
                </svg>
            </div>
            <div className="absolute bottom-20 left-20 w-7 h-7 text-green-400 opacity-60" style={{ animation: 'twinkle 5s infinite ease-in-out 1.2s' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1l2.5 5.5L20 9l-5.5 2.5L12 17l-2.5-5.5L4 9l5.5-2.5L12 1z" />
                </svg>
            </div>
            <div className="absolute bottom-40 right-20 w-8 h-8 text-blue-400 opacity-50" style={{ animation: 'twinkle 4.5s infinite ease-in-out 0.3s' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1l2.5 5.5L20 9l-5.5 2.5L12 17l-2.5-5.5L4 9l5.5-2.5L12 1z" />
                </svg>
            </div>

            {/* Login Form */}
            <div
                className={`w-full max-w-md p-8 bg-green-50 rounded-xl shadow-lg z-10 transition-all duration-500 ${isLoaded ? 'translate-y-0' : 'translate-y-10'}`}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                }}
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-semibold text-blue-900 relative group">
                        Waste Wizard
                        <span className="absolute -bottom-2 left-0 w-0 h-1 bg-green-400 transition-all duration-500 group-hover:w-full"></span>
                    </h1>
                    <p className="text-blue-800 mt-2">Login to access your dashboard</p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-blue-800 font-medium mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ transition: 'all 0.3s ease' }}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-blue-800 font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ transition: 'all 0.3s ease' }}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 rounded-lg text-white font-medium group transition-all duration-300 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 hover:shadow-md'}`}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>

            {/* Add CSS for twinkle animation */}
            <style jsx global>{`
                @keyframes twinkle {
                    0% { opacity: 0.2; transform: scale(0.8); }
                    50% { opacity: 0.6; transform: scale(1.1); }
                    100% { opacity: 0.2; transform: scale(0.8); }
                }
            `}</style>
        </div>
    );
}